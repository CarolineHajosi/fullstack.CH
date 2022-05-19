import { useEffect, useState } from 'react'
import { fixUrl } from '../utils'
import { Hamster } from '../models/hamster'
import AddHamster from './addHamster'

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
    await fetch(`/hamsters/${id}`, {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const getData: () => Promise<void> = async () => {
    const response = await fetch(fixUrl('/hamsters'))
    const data = await response.json()
    // om response.json misslyckas: kontrollera din URL, kontrollera om du får en HTML-sida
    setMyHamster(data)
  }

  return (
    <>
      <div>
        <AddHamster />
        <section className="wrapper">
          <section className="gallery">
            {myHamster
              ? myHamster.map((hamster) => (
                  <section key={hamster.id} className="myHamster">
                    <img src={fixUrl(`/img/${hamster.imgName}`)} />
                    <br />
                    <p>
                      Namn: {hamster.name}
                      <br />
                      Ålder: {hamster.age}
                      <br />
                      Älskar att {hamster.loves}
                      <br />
                      Äter gärna {hamster.favFood}
                      <br />
                      Vinster: {hamster.wins}
                      <br />
                      Förluster: {hamster.defeats}
                      <br />
                      Totala matcher: {hamster.games}
                    </p>

                    <button
                      className="remove-button"
                      onClick={() => removeHamster(hamster.id)}
                    >
                      Radera
                    </button>
                  </section>
                ))
              : 'Väntar på hamstrar'}
          </section>
        </section>
      </div>
    </>
  )

  async function callHamsters(allHamsters: any) {
    const url = '/hamsters'
    const response = await fetch(url)
    console.log('Alla hamstrar är på plats.')
    const data = await response.json()
    allHamsters(data)
  }
}

export default Galleri
