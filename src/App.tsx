import { useState } from 'react'
import headerLogo from './HAMSTER-WARS-black-logo.svg'
import './App.css'
import { fixUrl } from './utils'
import { Link, Route, Routes } from 'react-router-dom'
import Start from './components/start'
import Galleri from './components/galleri'
import Spela from './components/spela'

function App() {
  const [maybeData, setMaybeData] = useState<string[] | null>(null)

  const getData: () => Promise<void> = async () => {
    const response = await fetch(fixUrl('/hamsters'))
    const data = await response.json()
    setMaybeData(data)
  }

  return (
    <div className="App">
      <header>
        <img src={headerLogo} className="Header-logo" alt="headerLogo" />
      </header>
      <nav>
        <Link to="/">Start</Link>
        <Link to="/spela">Spela</Link>
        <Link to="/galleri">Galleri</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/galleri" element={<Galleri />} />
          <Route path="/spela" element={<Spela />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
