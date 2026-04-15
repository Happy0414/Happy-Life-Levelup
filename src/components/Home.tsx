import { useNavigate } from 'react-router-dom'
import './Home.css'

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
            <p>このアプリの説明は<a href='./About'>こちら</a></p>
        </div>
    )
}