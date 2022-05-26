import { useEffect, useState } from 'react'
import { fixUrl } from '../utils'
import { Hamster } from '../models/hamster'
import { useRecoilState } from 'recoil'
import AtomHamster from '../atoms/AtomHamster'
import hamsterLogo from '../HamsterLogo.jpg'

const Gulligast = () => {
  const [data, setData] = useRecoilState<null | Hamster[]>(AtomHamster)
  const [best, setBest] = useState<null | Hamster>(null)

  useEffect(() => {
    if (data !== null) {
      let hamsterArray = [...data].sort(
        (a, b) => a.wins - a.defeats - (b.wins - b.defeats)
      )
      let bestHamster = hamsterArray[hamsterArray.length - 1]
      const results = [...hamsterArray].filter((obj) => {
        return obj.wins - obj.defeats === bestHamster.wins - bestHamster.defeats
      })
      let resLength = results.length
      if (resLength > 0) {
        let randomBestHamster =
          results[Math.floor(Math.random() * results.length)]
        setBest(randomBestHamster)
      } else {
        setBest(bestHamster)
      }
    }
    console.log('Hamster med flest vinster: ', best)
  }, [data])

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="myBestHamster">
      {best ? (
        <div key={best.id}>
          <h3>{best.name}</h3>
          <img
            className="myHamsterImg"
            src={fixUrl(`/img/${best.imgName}`)}
            onError={(e) => {
              ;(e.target as HTMLImageElement).onerror = null
              ;(e.target as HTMLImageElement).src = hamsterLogo
            }}
            alt="Bild saknas"
          />

          <p>
            Vinster: {best.wins}.
            {/* <br />
            Förluster: {best.defeats}. */}
          </p>
        </div>
      ) : (
        <p>Väntar in den vinnande hamstern</p>
      )}
    </div>
  )

  async function getData() {
    const url = '/hamsters/'
    const correctUrl = fixUrl(url)

    const response = await fetch(correctUrl)
    const hamsterData: any = await response.json()

    setData(hamsterData as Hamster[])
  }
}

export default Gulligast
