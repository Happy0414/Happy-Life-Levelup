import formImg from '../assets/inputForm.png'
import './About.css'

export default function About(){
    return(
        <div>
        <h1>Happy-Level-Upについて</h1>
        <p>このアプリはあなた自身のレベルを可視化します。</p>
        <p>
            このアプリを作ったきっかけはとあるSNS上でのコメントで、
            「ゲームのレベル上げから自分のレベル上げにシフトしたことで
            人生が豊かになった」というコメントです。
        </p>
        <p>
            あなたが人生で経験したこと、
            なんでもいいのでこのアプリに記録して
            自分のレベルを可視化できるようにしましょう。
        </p>
        <p>
            具体的には経験値入力フォームで経験と
            その経験に対する経験値を自身で設定し入力します。
        </p>
        

        <img src={formImg} alt="ExpInputFormImage" width="500px"/>
        
        <p>経験と経験値を入力するとCurrent Expが増えて
            100経験値取得するごとにレベルが1上がります。
        </p>
        
        <p>※現在は開発途中なのであなたのレベルはページを更新するとリセットされます。</p>
        </div>

    )
}