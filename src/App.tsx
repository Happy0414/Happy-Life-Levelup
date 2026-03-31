import { useState } from 'react'
import './App.css'

type Status = {
  level: number
  totalexp: number
}

type Experience = {
  experience: string
  exp: number
}

function App() {
  const [experience, setExperience] = useState('')
  const [exp, setExp] = useState(0)
  const [experiences, setExperiences] = useState<Experience[]>([])

  const addExperience = () => {
    if (!experience.trim()) return

    setExperiences((current) => [
      ...current,
      { experience: experience.trim(), exp },
    ])
    setExperience('')
    setExp(0)
  }


  const culculateLevel = (exps: Experience[]) => {
    const newStatus: Status = {
      level: 1,
      totalexp: 0
    }

    for (let i = 0; i < exps.length; i++){
      newStatus.totalexp += exps[i].exp
      if(newStatus.totalexp >= 100){
        newStatus.level += Math.floor(newStatus.totalexp / 100)
        newStatus.totalexp -= 100 * Math.floor(newStatus.totalexp / 100)
      }
    }

    return newStatus
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
      <h1>Happy-Level-Up</h1>
      <h2>Level: {culculateLevel(experiences).level}<span>（{levelMessage(culculateLevel(experiences).level)}）</span></h2>
      <h2>Current Exp: {culculateLevel(experiences).totalexp} / 100</h2>

      <input
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        placeholder="経験を入力(例：筋トレ）"
      />

      <input
        type="number"
        max="100"
        value={exp}
        onChange={(e) => setExp(Number(e.target.value))}
      />

      <button onClick={addExperience}>追加</button>

      {experiences.map((item, index) => (
        <div key={index} className="experience-item">
          <p>経験：{item.experience}</p>
          <p>経験値：{item.exp}</p>
        </div>
      ))}
    </>
  )
}

export default App
