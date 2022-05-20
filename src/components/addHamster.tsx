import { useState } from 'react'
import { fixUrl } from '../utils'

const addHamster = () => {
  const [newName, putNewName] = useState<string>('')
  const [newAge, putNewAge] = useState<number>(0)
  const [newFood, putNewFood] = useState<string>('')
  const [newLoves, putNewLoves] = useState<string>('')
  const [newImg, putNewImg] = useState<string>('')

  const [newNameChanged, putNewNameChanged] = useState<boolean>(false)
  const [newHamsterAgeChanged, putNewAgeChanged] = useState<boolean>(false)
  const [newFoodChanged, setnewFoodChanged] = useState<boolean>(false)
  const [newLovesChanged, setnewLovesChanged] = useState<boolean>(false)
  const [newImgChanged, setnewImgChanged] = useState<boolean>(false)

  const handleNameChange = (e: string | any) => {
    putNewName(e.target.value)
    putNewNameChanged(false)
    if (e.target.value.length >= 2) {
      putNewNameChanged(true)
      console.log('Namnet har fler än 1 bokstav, godkänt.')
    } else if (e.target.value.length <= 2) {
      putNewNameChanged(false)
      console.log('Namnet måste innehålla fler än 1 bokstav, inte godkänt.')
    }
  }

  const handleAgeChange = (e: number | any) => {
    const ageIsValid = isValidAge(newAge)
    putNewAgeChanged(ageIsValid)
    if (e.target.valueAsNumber) {
      putNewAge(e.target.valueAsNumber)
    }
    if (ageIsValid) {
      console.log('Åldern är en siffra, godkänt.')
    }
  }

  const handleFavFoodChange = (e: string | any) => {
    putNewFood(e.target.value)
    setnewFoodChanged(false)
    if (e.target.value.length >= 2) {
      setnewFoodChanged(true)
      console.log('Favoritmaten har fler än 1 bokstav, godkänt.')
    } else if (e.target.value.length <= 2) {
      setnewFoodChanged(false)
      console.log(
        'Favoritmaten måste innehålla fler än 1 bokstav, inte godkänt.'
      )
    }
  }

  const handleLovesChange = (e: string | any) => {
    putNewLoves(e.target.value)
    setnewLovesChanged(false)
    if (e.target.value.length >= 2) {
      setnewLovesChanged(true)
      console.log('Älsklingsaktiviteten har fler än 1 bokstav, godkänt.')
    } else if (e.target.value.length <= 2) {
      setnewLovesChanged(false)
      console.log(
        'Älsklingsaktiviteten måste ha fler än 1 bokstav, inte godkänt.'
      )
    }
  }

  const handleImgNameChange = (e: string | any) => {
    putNewImg(e.target.value)
    setnewImgChanged(false)
    if (e.target.value.includes('.jpg')) {
      setnewImgChanged(true)
      console.log('Bildnamnet är en jpg, godkänt.')
    } else if (!e.target.value.includes('.jpg')) {
      setnewImgChanged(false)
      console.log('Bildnamnet måste vara en jpg, inte godkänt.')
    }
  }

  let data = {
    name: newName,
    age: newAge,
    favFood: newFood,
    loves: newLoves,
    imgName: newImg,
    wins: 0,
    defeats: 0,
    games: 0,
  }

  const newHamster = async () => {
    const url = '/hamsters'
    const correctUrl = fixUrl(url)
    if (
      newNameChanged &&
      newHamsterAgeChanged &&
      newFoodChanged &&
      newLovesChanged &&
      newImgChanged == true
    ) {
      await fetch(correctUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Här är: ', data)
        })
        .catch((error) => {
          console.log('Fel: ', error)
        })
    } else console.log('Något saknas, är alla fält ifyllda?')
  }

  return (
    <div className="hamsterInput">
      <input
        type="text"
        placeholder="Namn"
        value={newName}
        onChange={handleNameChange}
      />
      <input
        type="number"
        placeholder="Ålder"
        value={newAge}
        onChange={handleAgeChange}
      />
      <input
        type="text"
        placeholder="Favoritmat"
        value={newFood}
        onChange={handleFavFoodChange}
      />
      <input
        type="text"
        placeholder="Älskar"
        value={newLoves}
        onChange={handleLovesChange}
      />
      <input
        type="text"
        placeholder="Bild (.jpg)"
        value={newImg}
        onChange={handleImgNameChange}
      />
      <button className="addHamsterButton" onClick={() => newHamster()}>
        Lägg till ny hamster
      </button>
    </div>
  )
}

function isValidAge(age: number): boolean {
  if (age < 0) return false
  if (isNaN(age)) return false
  let ageString = String(age)

  if (ageString.includes(',') || ageString.includes('.')) return false
  return true
}

export default addHamster
