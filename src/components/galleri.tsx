import { useEffect, useState } from 'react'
import { fixUrl } from '../utils'
import { Hamster } from '../models/hamster'
import AddHamster from './addHamster'
import hamsterLogo from '../HamsterLogo.jpg'

const Galleri = () => {
  const [myHamster, setMyHamster] = useState<Hamster[] | null>(null)

  useEffect(() => {
    async function send() {
      await callHamsters(setMyHamster)
    }
    send()
  }, [])

  const removeHamster = (id: string): void => {
    const newList = myHamster
      ? myHamster.filter((hamster) => hamster.id !== id)
      : null
    setMyHamster(newList)
    removeFromGallery(id)
  }

  async function removeFromGallery(id: any) {
    fetch(fixUrl(`/hamsters/${id}`), {
      method: 'DELETE',
    })
  }

  const getHamsterUrl = (hamsterImgName: string): string => {
    if (hamsterImgName.startsWith('https:')) {
      return hamsterImgName
    }
    return fixUrl(`/img/${hamsterImgName}`)
  }

  const updateHamsters = (): void => {
    async function send() {
      await callHamsters(setMyHamster)
    }
    send()
  }

  return (
    <>
      <h3>Galleriet</h3>
      <p>
        Här nedan kan du se alla hamstrarna i appen.
        <br />
        Du kan lägga till en egen hamster genom att fylla i formuläret.
        <br />
        Du kan även välja att ta bort en hamster genom att trycka på det röda
        krysset under hamstern.
      </p>
      <AddHamster updateHamsters={updateHamsters} />
      <section className="gallery">
        {myHamster
          ? myHamster.map((hamster) => (
              <section key={hamster.id} className="myHamster">
                <h3>{hamster.name}</h3>
                <img
                  src={getHamsterUrl(hamster.imgName)}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).onerror = null
                    ;(e.target as HTMLImageElement).src = hamsterLogo
                  }}
                  alt="Bild saknas"
                />

                <br />
                <p>
                  Ålder: {hamster.age}.
                  <br />
                  Älskar att {hamster.loves}.
                  <br />
                  Äter gärna {hamster.favFood}.
                  <br />
                  Vinster: {hamster.wins}.
                  <br />
                  Förluster: {hamster.defeats}.
                  <br />
                  Totala matcher: {hamster.games}.
                </p>

                <button
                  className="removeHamsterButton"
                  onClick={() => removeHamster(hamster.id)}
                >
                  X
                </button>
              </section>
            ))
          : 'Väntar på hamstrar'}
      </section>
    </>
  )

  async function callHamsters(setMyHamster: (data: Hamster[]) => void) {
    const url = '/hamsters'
    const correctUrl = fixUrl(url)
    const response = await fetch(correctUrl)
    console.log(' Alla hamstrar är på plats.')
    const data = await response.json()
    setMyHamster(data)
  }
}

export default Galleri
