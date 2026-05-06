import { useEffect, useState } from 'react'
import LevelUpModal from './LevelUpModal'
import './ExperiencePage.css'
import { useNavigate } from 'react-router-dom'

type Status = {
  level: number
  currentExp: number
  totalExp: number
  nextLevelExp: number
}

type Experience = {
  experience: string
  exp: number
}

export default function ExpPage(){
  const [experience, setExperience] = useState('')
  const [exp, setExp] = useState(0)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [status, setStatus] = useState<Status>({
    level: 1,
    currentExp: 0,
    totalExp: 0,
    nextLevelExp: 100,
  })
  const [isLUModal, setLUModal] = useState<boolean>(false)
  const navigate = useNavigate()


  useEffect(() => {
    const loadInitialData = async () => {
      const expResponse = await fetch('http://localhost:3001/api/experiences')
      const expData = await expResponse.json()

      const statusResponse = await fetch('http://localhost:3001/api/status')
      const statusData = await statusResponse.json()

      setExperiences(expData.items)
      setStatus(statusData)
    }

    loadInitialData()
  }, [])



  


  const onClose = () => {
      setLUModal(false)
  }

  const addExperience = async () => {
  if (!experience.trim()) return

  const response = await fetch('http://localhost:3001/api/experiences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      experience: experience.trim(),
      exp,
    }),
  })

    const data = await response.json()

    setExperiences((prev) => [...prev, data.item])
    setStatus(data.status)

    if (data.levelUp) {
      setLUModal(true)
    }

    setExperience('')
    setExp(0)
  }


  const levelMessage = (level: number) => {
    if(level < 10) return 'これから頑張っていきましょう！'
    if(level < 20) return '順調に成長していますね！'
    if(level < 30) return '素晴らしい成長です！'
    if(level < 40) return 'あなたはもうすぐレベル40ですね！'
    if(level < 50) return 'レベル50まであと少し！'
    if(level < 60) return 'レベル60まであと少し！'
    if(level < 70) return 'レベル70まであと少し！'
    if(level < 80) return 'レベル80まであと少し！'
    if(level < 90) return 'レベル90まであと少し！'
    if(level < 100) return 'レベル100まであと少し！'
    return 'あなたはレベル100を超えました！おめでとうございます！'
  }

  return (
    <>
      <LevelUpModal isOpen={isLUModal} level={status.level} onClose={onClose}/>
      
      <h1>Experiences Input Form</h1>
      <h2>Level: {status.level}<span>（{levelMessage(status.level)}）</span></h2>
      <h2>Current Exp: {status.currentExp} / 100</h2>

      <div className="inputItems">
        <input
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="経験を入力(例：筋トレ）"
        />

        <span>経験に対する経験値を入力：</span>
        <input
          type="number"
          min="0"
          max="100"
          value={exp}
          onChange={(e) => setExp(Number(e.target.value))}
        />

        <button onClick={addExperience} className="addBtn">追加</button>
      </div>

      {experiences.map((item, index) => (
        <div key={index} className="experience-item">
          <p className="expContents">経験：{item.experience}</p>
          <p className="expValue">経験値：{item.exp}</p>
        </div>
      ))}

      <button onClick={() => navigate('/Graph')}>Graphへ</button>
    </>
  )
}