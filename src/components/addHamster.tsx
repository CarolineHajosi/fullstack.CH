import { fixUrl } from '../utils'
import { useState } from 'react'

interface IAddHamster {
  updateHamsters(): void
}

const addHamster: React.FC<IAddHamster> = ({ updateHamsters }) => {
  const [newName, putNewName] = useState<string>('')
  const [newAge, putNewAge] = useState<number>(0)
  const [newFood, putNewFood] = useState<string>('')
  const [newLoves, putNewLoves] = useState<string>('')
  const [newImg, putNewImg] = useState<string>('')

  const [newNameChanged, putNewNameChanged] = useState<boolean>(false)
  const [newHamsterAgeChanged, putNewAgeChanged] = useState<boolean>(false)
  const [newFoodChanged, setNewFoodChanged] = useState<boolean>(false)
  const [newLovesChanged, setNewLovesChanged] = useState<boolean>(false)
  const [newImgChanged, setNewImgChange] = useState<boolean>(false)

  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleNameChange = (e: string | any) => {
    putNewName(e.target.value)
    putNewNameChanged(false)
    if (e.target.value.length >= 2) {
      putNewNameChanged(true)
      setErrorMessage('')
      console.log('Namnet har fler än 1 bokstav, godkänt.')
    } else if (e.target.value.length <= 2) {
      putNewNameChanged(false)
      setErrorMessage('Namnet måste innehålla fler än 1 bokstav, inte godkänt.')
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
      setErrorMessage('')
    } else {
      setErrorMessage('Åldern måste vara ett positivt tal, inte godkänt.')
    }
  }

  const handleFavFoodChange = (e: string | any) => {
    putNewFood(e.target.value)
    setNewFoodChanged(false)
    if (e.target.value.length >= 2) {
      setNewFoodChanged(true)
      setErrorMessage('')
      console.log('Favoritmaten har fler än 1 bokstav, godkänt.')
    } else if (e.target.value.length <= 2) {
      setNewFoodChanged(false)
      setErrorMessage(
        'Favoritmaten måste innehålla fler än 1 bokstav, inte godkänt.'
      )
      console.log(
        'Favoritmaten måste innehålla fler än 1 bokstav, inte godkänt.'
      )
    }
  }

  const handleLovesChange = (e: string | any) => {
    putNewLoves(e.target.value)
    setNewLovesChanged(false)
    if (e.target.value.length >= 2) {
      setNewLovesChanged(true)
      setErrorMessage('')
      console.log('Älsklingsaktiviteten har fler än 1 bokstav, godkänt.')
    } else if (e.target.value.length <= 2) {
      setNewLovesChanged(false)
      setErrorMessage(
        'Älsklingsaktiviteten måste ha fler än 1 bokstav, inte godkänt.'
      )
      console.log(
        'Älsklingsaktiviteten måste ha fler än 1 bokstav, inte godkänt.'
      )
    }
  }

  const handleImgNameChange = (e: string | any) => {
    putNewImg(e.target.value)
    setNewImgChange(false)
    if (e.target.value.length >= 2) {
      setNewImgChange(true)
      setErrorMessage('')
      console.log('Bildlänken har fler än 1 bokstav, godkänt.')
      console.log(newImg)
    } else if (e.target.value.length <= 2) {
      setNewImgChange(false)
      setErrorMessage('Bildlänken måste ha fler än 1 bokstav, inte godkänt.')
      console.log('Bildlänken måste ha fler än 1 bokstav, inte godkänt.')
    }
  }

  let myNewHamster = {
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
        body: JSON.stringify(myNewHamster),
      })
        .then((response) => response.json())
        .then((myNewHamster) => {
          setErrorMessage('')
          console.log('Här är: ', myNewHamster)
          updateHamsters()
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
        placeholder="Bild-länk"
        value={newImg}
        onChange={handleImgNameChange}
      />

      <br />
      <p className="error">{errorMessage}</p>
      <button className="addHamsterButton" onClick={() => newHamster()}>
        Lägg till ny hamster
      </button>
    </div>
  )
}

function isValidAge(age: number): boolean {
  if (age < 0) {
    console.log('Åldern kan inte vara en negativ siffra, ändra det.')
    return false
  }
  if (isNaN(age)) return false
  let ageString = String(age)

  if (ageString.includes(',') || ageString.includes('.')) return false
  return true
}

export default addHamster
