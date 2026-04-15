import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import ExpPage from './components/ExperiencePage'
import Graph from './components/graph'
import Home from './components/Home'


function App() {

  return(
  <div>
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/ExpPage">ExpPage</Link> | <Link to="/Graph">Graph</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Exppage" element={<ExpPage />} />
        <Route path="/Graph" element={<Graph />} />
      </Routes>
    </BrowserRouter>
  </div>
  )
}

export default App
