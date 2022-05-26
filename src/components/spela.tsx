import { useEffect, useState } from 'react'
import { Hamster } from '../models/hamster'
import { fixUrl } from '../utils'
import hamsterLogo from '../HamsterLogo.jpg'

export const imgHamster = {
  width: '350px',
  height: 'auto',
  margin: '15px',
}

const Spela = () => {
  const [hamsterWarrior1, setHamsterWarrior1] = useState<null | Hamster>(null)
  const [hamsterWarrior2, setHamsterWarrior2] = useState<null | Hamster>(null)
  const [voted, setVoted] = useState(false)
  const [resultWinner, setResultWinner] = useState<any>(null)
  const [resultLoser, setResultLoser] = useState<any>(null)
  const [newFight, setNewFight] = useState(false)

  useEffect(() => {
    async function getFirstWarrior() {
      const url = '/hamsters/random'
      const correctUrl = fixUrl(url)
      const response = await fetch(correctUrl, { method: 'GET' })

      const data: Hamster = await response.json()
      setHamsterWarrior1(data)
      setVoted(false)
      setNewFight(false)
    }
    getFirstWarrior()
  }, [newFight])

  useEffect(() => {
    async function getSecondWarrior() {
      const url = '/hamsters/random'
      const correctUrl = fixUrl(url)

      const response = await fetch(correctUrl, { method: 'GET' })
      const data: Hamster = await response.json()
      setHamsterWarrior2(data)
      setVoted(false)
    }
    getSecondWarrior()
  }, [newFight])

  function voting(winner: Hamster, loser: Hamster) {
    if (winner && loser) {
      const updateWins = {
        wins: winner.wins + 1,
        games: winner.games + 1,
      }
      const updateDefeats = {
        defeats: loser.defeats + 1,
        games: loser.games + 1,
      }

      if (hamsterWarrior1 && hamsterWarrior2) {
        let fightWinner: Hamster
        let fightLoser: Hamster
        if (hamsterWarrior1.id === winner.id) {
          fightWinner = hamsterWarrior1
          fightLoser = hamsterWarrior2
        } else {
          fightWinner = hamsterWarrior2
          fightLoser = hamsterWarrior1
        }
        fightWinner.wins = winner.wins + 1
        fightWinner.games = winner.games + 1
        fightLoser.defeats = loser.defeats + 1
        fightLoser.games = loser.games + 1

        setResultWinner(fightWinner)
        setResultLoser(fightLoser)

        Promise.all([
          putRequestWarrior(winner.id, updateWins),
          putRequestWarrior(loser.id, updateDefeats),
          postRequestMatch(winner.id, loser.id),
        ]).then(() => {
          setVoted(true)
        })

        console.log(
          'Vinnare: ' + fightWinner.name,
          'Förlorare: ' + fightLoser.name
        )
      }
    }
  }

  async function putRequestWarrior(id: string | number, update: any) {
    const response = await fetch(fixUrl(`/hamsters/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })
    const data = await response.text()
    console.log('Skickat: ' + data)
  }

  async function postRequestMatch(
    winnerId: string | number,
    loserId: string | number
  ) {
    const matchToSend = { winnerId: winnerId, loserId: loserId }
    const url = '/matches'
    const correctUrl = fixUrl(url)

    const response = await fetch(correctUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchToSend),
    })
  }

  function vote() {
    if (!voted) {
      if (hamsterWarrior1 && hamsterWarrior2) {
        return (
          <section className="battle">
            {hamsterWarrior1 ? (
              <div className="warrior1" key={hamsterWarrior1.id}>
                <h1>{hamsterWarrior1.name}</h1>
                <img
                  style={imgHamster}
                  src={fixUrl(`/img/${hamsterWarrior1.imgName}`)}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).onerror = null
                    ;(e.target as HTMLImageElement).src = hamsterLogo
                  }}
                  alt="Bild saknas"
                />

                <p>
                  Känd för sin förmåga att {hamsterWarrior1.loves} och sin
                  stadiga diet av {hamsterWarrior1.favFood}
                </p>
                <button
                  className="voteButton"
                  onClick={() => voting(hamsterWarrior1, hamsterWarrior2)}
                >
                  Rösta
                </button>
              </div>
            ) : (
              'Hämtar en krigshamster...'
            )}

            {hamsterWarrior2 ? (
              <div className="warrior2" key={hamsterWarrior2.id}>
                <h1>{hamsterWarrior2.name}</h1>
                <img
                  style={imgHamster}
                  src={fixUrl(`/img/${hamsterWarrior2.imgName}`)}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).onerror = null
                    ;(e.target as HTMLImageElement).src = hamsterLogo
                  }}
                  alt="Bild saknas"
                />
                <p>
                  Den stora passionen är att {hamsterWarrior2.loves} och att
                  samla {hamsterWarrior2.favFood}
                </p>

                <button
                  className="voteButton"
                  onClick={() => voting(hamsterWarrior2, hamsterWarrior1)}
                >
                  Rösta
                </button>
              </div>
            ) : (
              'Hämtar en krigshamster...'
            )}
          </section>
        )
      }
    }
  }

  function fightAgain() {
    setNewFight(true)
  }

  function whenVoted() {
    if (voted) {
      if (resultWinner && resultLoser) {
        return (
          <section className="battle">
            {resultWinner ? (
              <div className="winningWarrior" key={resultWinner.id}>
                <h2>Vinnare!</h2>
                <h3>{resultWinner.name}</h3>
                <img
                  style={imgHamster}
                  src={fixUrl(`/img/${resultWinner.imgName}`)}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).onerror = null
                    ;(e.target as HTMLImageElement).src = hamsterLogo
                  }}
                  alt="Bild saknas"
                />
                <p>
                  <b>Vinster: </b>
                  {resultWinner.wins}.
                </p>
                <p>
                  <b>Förluster: </b>
                  {resultWinner.defeats}.
                </p>
              </div>
            ) : (
              'Laddar vinnande hamster'
            )}
            {resultLoser ? (
              <div className="loserWarrior" key={resultLoser.id}>
                <h2>Förlorare!</h2>
                <h3>{resultLoser.name}</h3>
                <img
                  style={imgHamster}
                  src={fixUrl(`/img/${resultLoser.imgName}`)}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).onerror = null
                    ;(e.target as HTMLImageElement).src = hamsterLogo
                  }}
                  alt="Bild saknas"
                />
                <p>
                  <b>Vinster: </b>
                  {resultLoser.wins}.
                </p>
                <p>
                  <b>Förluster: </b>
                  {resultLoser.defeats}.
                </p>
              </div>
            ) : (
              'Laddar förlorande hamster'
            )}
            <button className="battleButton" onClick={fightAgain}>
              Ny match
            </button>
          </section>
        )
      }
    }
  }

  const done = vote()
  const result = whenVoted()

  return (
    <div className="battleWrapper">
      <h3>Spela Hamster Wars</h3>
      <p>
        Nedan presenteras två urgulliga hamstrar.
        <br />
        Du väljer din favorit genom att trycka på "rösta" under hamsterns bild.
        <br />
        Du startar där efter nästa match genom att klicka på "ny match".
      </p>
      {done}
      {result}
      <section className="battle"></section>
    </div>
  )
}

export default Spela
