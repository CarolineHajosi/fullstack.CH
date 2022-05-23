import { useEffect, useState } from 'react'
import { Hamster } from '../models/hamster'
import { fixUrl } from '../utils'

export const imgHamster = {
  width: '300px',
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
    const data = response.text()
    console.log('Skickat: ' + data)
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
                  alt={'Bild saknas.'}
                  onClick={() => voting(hamsterWarrior1, hamsterWarrior2)}
                />

                <p>
                  Känd för sin förmåga att {hamsterWarrior1.loves} och sin
                  stadiga diet av {hamsterWarrior1.favFood}
                </p>
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
                  alt={'Bild saknas.'}
                  onClick={() => voting(hamsterWarrior1, hamsterWarrior2)}
                />
                <p>
                  Den stora passionen är att {hamsterWarrior2.loves} och att
                  samla {hamsterWarrior2.favFood}
                </p>
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
              <div className="warrior1" key={resultWinner.id}>
                <h3>Vinnare!</h3>
                <h5>{resultWinner.name}</h5>
                <img
                  style={imgHamster}
                  src={fixUrl(`/img/${resultWinner.imgName}`)}
                  alt={'Bild saknas.'}
                />
                <p>
                  <b>Vunna matcher: </b>
                  {resultWinner.wins} st
                </p>
                <p>
                  <b>Förlorade matcher: </b>
                  {resultWinner.defeats} st
                </p>
              </div>
            ) : (
              'Laddar vinnande hamster'
            )}
            {resultLoser ? (
              <div className="warrior2" key={resultLoser.id}>
                <h3>Förlorare!</h3>
                <h5>{resultLoser.name}</h5>
                <img
                  style={imgHamster}
                  src={fixUrl(`/img/${resultLoser.imgName}`)}
                  alt={'Bild saknas.'}
                />
                <p>
                  <b>Vunna matcher: </b>
                  {resultLoser.wins} st
                </p>
                <p>
                  <b>Förlorade matcher: </b>
                  {resultLoser.defeats} st
                </p>
              </div>
            ) : (
              'Laddar förlorande hamster'
            )}
            <button onClick={fightAgain}>SPELA IGEN</button>
          </section>
        )
      }
    }
  }

  const done = vote()
  const result = whenVoted()

  return (
    <div className="battleWrapper">
      <h2>Välj den hamster du tycker är sötast</h2>
      <h4>Tryck på bilden för att lägga din röst</h4>
      {done}
      {result}
      <section className="battle"></section>
    </div>
  )
}

export default Spela
