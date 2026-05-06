package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"
)

const maxBodySize = 1 << 20

type experienceEntry struct {
	ID         string `json:"id"`
	Experience string `json:"experience"`
	Exp        int    `json:"exp"`
	CreatedAt  string `json:"createdAt"`
}

type experienceInput struct {
	Experience string `json:"experience"`
	Exp        *int   `json:"exp"`
}

type status struct {
	Level        int `json:"level"`
	CurrentExp   int `json:"currentExp"`
	TotalExp     int `json:"totalExp"`
	NextLevelExp int `json:"nextLevelExp"`
}

type store struct {
	dataFile string
	mu       sync.Mutex
}

func main() {
	dataFile := os.Getenv("DATA_FILE")
	if dataFile == "" {
		dataFile = filepath.Join("server", "data", "experiences.json")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	app := &store{dataFile: dataFile}
	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", app.handleHealth)
	mux.HandleFunc("/api/experiences", app.handleExperiences)
	mux.HandleFunc("/api/status", app.handleStatus)

	server := &http.Server{
		Addr:              ":" + port,
		Handler:           cors(mux),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("Backend running on http://localhost:%s", port)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (s *store) handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/api/health" {
		writeJSON(w, http.StatusNotFound, map[string]string{"message": "Not found"})
		return
	}

	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"message": "Method not allowed"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (s *store) handleExperiences(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/api/experiences" {
		writeJSON(w, http.StatusNotFound, map[string]string{"message": "Not found"})
		return
	}

	switch r.Method {
	case http.MethodGet:
		s.handleListExperiences(w)
	case http.MethodPost:
		s.handleCreateExperience(w, r)
	default:
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"message": "Method not allowed"})
	}
}

func (s *store) handleStatus(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/api/status" {
		writeJSON(w, http.StatusNotFound, map[string]string{"message": "Not found"})
		return
	}

	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"message": "Method not allowed"})
		return
	}

	experiences, err := s.readExperiences()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"message": "Failed to read experiences"})
		return
	}

	writeJSON(w, http.StatusOK, calculateStatus(experiences))
}

func (s *store) handleListExperiences(w http.ResponseWriter) {
	experiences, err := s.readExperiences()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"message": "Failed to read experiences"})
		return
	}

	writeJSON(w, http.StatusOK, map[string][]experienceEntry{"items": experiences})
}

func (s *store) handleCreateExperience(w http.ResponseWriter, r *http.Request) {
	var input experienceInput
	decoder := json.NewDecoder(http.MaxBytesReader(w, r.Body, maxBodySize))
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&input); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"message": "Request body must be valid JSON"})
		return
	}

	value, validationErrors := validateExperienceInput(input)
	if len(validationErrors) > 0 {
		writeJSON(w, http.StatusBadRequest, map[string]any{
			"message": "Invalid experience input",
			"errors":  validationErrors,
		})
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	experiences, err := s.readExperiencesLocked()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"message": "Failed to read experiences"})
		return
	}

	beforeStatus := calculateStatus(experiences)
	item := experienceEntry{
		ID:         newID(),
		Experience: value.Experience,
		Exp:        value.Exp,
		CreatedAt:  time.Now().UTC().Format(time.RFC3339),
	}

	nextExperiences := append(experiences, item)
	if err := s.writeExperiencesLocked(nextExperiences); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"message": "Failed to save experience"})
		return
	}

	nextStatus := calculateStatus(nextExperiences)
	writeJSON(w, http.StatusCreated, map[string]any{
		"item":         item,
		"status":       nextStatus,
		"levelUp":      nextStatus.Level > beforeStatus.Level,
		"levelsGained": nextStatus.Level - beforeStatus.Level,
	})
}

func validateExperienceInput(input experienceInput) (experienceEntry, []string) {
	var validationErrors []string
	experience := strings.TrimSpace(input.Experience)

	if experience == "" {
		validationErrors = append(validationErrors, "experience is required")
	}

	if input.Exp == nil || *input.Exp < 0 || *input.Exp > 100 {
		validationErrors = append(validationErrors, "exp must be an integer from 0 to 100")
	}

	if len(validationErrors) > 0 {
		return experienceEntry{}, validationErrors
	}

	return experienceEntry{
		Experience: experience,
		Exp:        *input.Exp,
	}, nil
}

func (s *store) readExperiences() ([]experienceEntry, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	return s.readExperiencesLocked()
}

func (s *store) readExperiencesLocked() ([]experienceEntry, error) {
	content, err := os.ReadFile(s.dataFile)
	if errors.Is(err, os.ErrNotExist) {
		return []experienceEntry{}, nil
	}
	if err != nil {
		return nil, err
	}

	var experiences []experienceEntry
	if err := json.Unmarshal(content, &experiences); err != nil {
		return nil, err
	}

	return experiences, nil
}

func (s *store) writeExperiencesLocked(experiences []experienceEntry) error {
	if err := os.MkdirAll(filepath.Dir(s.dataFile), 0755); err != nil {
		return err
	}

	content, err := json.MarshalIndent(experiences, "", "  ")
	if err != nil {
		return err
	}

	tempFile := s.dataFile + ".tmp"
	if err := os.WriteFile(tempFile, append(content, '\n'), 0644); err != nil {
		return err
	}

	return os.Rename(tempFile, s.dataFile)
}

func calculateStatus(experiences []experienceEntry) status {
	totalExp := 0
	for _, item := range experiences {
		totalExp += item.Exp
	}

	return status{
		Level:        1 + totalExp/100,
		CurrentExp:   totalExp % 100,
		TotalExp:     totalExp,
		NextLevelExp: 100,
	}
}

func writeJSON(w http.ResponseWriter, code int, body any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)

	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Printf("failed to write JSON response: %v", err)
	}
}

func newID() string {
	var bytes [16]byte
	if _, err := rand.Read(bytes[:]); err != nil {
		return "exp_" + strconv.FormatInt(time.Now().UnixNano(), 36)
	}

	return fmt.Sprintf(
		"%s-%s-%s-%s-%s",
		hex.EncodeToString(bytes[0:4]),
		hex.EncodeToString(bytes[4:6]),
		hex.EncodeToString(bytes[6:8]),
		hex.EncodeToString(bytes[8:10]),
		hex.EncodeToString(bytes[10:16]),
	)
}
