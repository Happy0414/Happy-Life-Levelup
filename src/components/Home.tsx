import './Home.css'
import { useNavigate, Link } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()

    return(
        <div>
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
        <h2>自分のレベルを可視化しましょう</h2>
        <button onClick={() => navigate('/Exppage')} className="startBtn">はじめる</button>
        <p>このアプリの説明は<Link to='./About'>こちら</Link></p>
        </div>
    )
}
