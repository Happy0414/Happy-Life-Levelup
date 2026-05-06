import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'
import ExpPage from './components/ExperiencePage'
import Graph from './components/graph'
import Home from './components/Home'
import About from './components/About'


function App() {
  const navigate = useNavigate()

  return(
  <div>
    <header>
      <button onClick={() => navigate('/')} className="headBtn">Home</button>
      <button onClick={() => navigate('/Exppage')} className="headBtn">ExpPage</button>
      <button onClick={() => navigate('/Graph')} className="headBtn">Graph</button>
    </header>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Exppage" element={<ExpPage />} />
      <Route path="/Graph" element={<Graph />} />
      <Route path="/About" element={<About />} />
    </Routes>
  </div>
  )
}

export default App
