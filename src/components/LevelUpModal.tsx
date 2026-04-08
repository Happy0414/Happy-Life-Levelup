import './LevelUpModal.css'

type Props =  {
    isOpen: boolean
    level: number 
    expName: string
    exp: number 
    onClose: () => void
}

function LevelUpModal({isOpen, level, expName, exp, onClose}: Props){
    if (!isOpen) return null

    return (
        <div onClick={onClose} className="overLay">
            <p>外側をクリックで閉じる</p>
            <div onClick={e => {e.stopPropagation()}} className="modalBox">
                <p>テストでレベルを表示：{level}</p>
                <p>{expName}</p>
                <p>{exp}</p>
                <button onClick={onClose}>閉じる</button>
            </div>
        </div>
    )
}

export default LevelUpModal