import { useState } from 'react'
import './App.css'
import LevelUpModal from './components/LevelUpModal'

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
  const [isLUModal, setLUModal] = useState<boolean>(false)

  const onClose = () => {
      setLUModal(false)
  }

  const addExperience = () => {
    if (!experience.trim()) return

    if(exp >= 0 && exp <= 100){
      const currentStatus: Status = culculateLevel(experiences)  //現在のステータス（レベル、トータル経験値）を記録

      const nextExperiences: Experience[] = [                   //入力した経験を現在のexperiencesに追加してnextExperiencesとする
        ...experiences,
        {experience: experience.trim(), exp: exp}
      ]

      const nextStatus: Status = culculateLevel(nextExperiences)    //新たなステータスを経験を追加した配列を基に記録

      if(nextStatus.level-currentStatus.level > 0){             //新たなステータスと過去のステータスのレベルの差が0より大きかったら
        setLUModal(true)                                        //レベルアップモーダルを開く
      }                                                           

      setExperiences(nextExperiences)                           //経験を追加した経験配列をexperiencesにセット

    }else{
      alert('入力できる数値は0~100です！')
      return
    }
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
      <LevelUpModal isOpen={isLUModal} level={culculateLevel(experiences).level} expName={'a'} exp={10} onClose={onClose}/>
      <h1 className="title">
      <span>H</span>
      <span>a</span>
      <span>p</span>
      <span>p</span>
      <span>y</span>
      <span>-</span>
      <span>L</span>
      <span>e</span>
      <span>v</span>
      <span>e</span>
      <span>l</span>
      <span>-</span>
      <span>U</span>
      <span>p</span>
    </h1>
      <h2>Level: {culculateLevel(experiences).level}<span>（{levelMessage(culculateLevel(experiences).level)}）</span></h2>
      <h2>Current Exp: {culculateLevel(experiences).totalexp} / 100</h2>

      <div className="inputItems">
        <input
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="経験を入力(例：筋トレ）"
        />

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

      <button onClick={() => setLUModal(true)}>モーダルを表示</button>
    </>
  )
}

export default App
