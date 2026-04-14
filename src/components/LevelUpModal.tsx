import './LevelUpModal.css'

type Props =  {
    isOpen: boolean
    level: number 
    onClose: () => void
}

function LevelUpModal({isOpen, level, onClose}: Props){
    if (!isOpen) return null

    return (
        <div onClick={onClose} className="overLay">
            <p>外側をクリックで閉じる</p>
            <div onClick={e => {e.stopPropagation()}} className="modalBox">
                <p>レベルが上がりました!</p>
                <p>現在のレベルは{level}!</p>
                <button onClick={onClose}>閉じる</button>
            </div>
        </div>
    )
}

export default LevelUpModal