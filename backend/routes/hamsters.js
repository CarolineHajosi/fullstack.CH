import express from 'express'
const router = express.Router()
const colRef = collection(db, 'hamsters')
import { db } from '../database/firebase.js'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'

// Data hämtas från Firestore!
// Routes
// RESTful == har GET, POST, PUT och DELETE

//GET - Hämta alla hamstrar
router.get('/', async (req, res) => {
  const colRef = collection(db, 'hamsters')
  const snapshot = await getDocs(colRef)

  if (snapshot.empty) {
    res.status(404).send('404 - Hamster not found')
    return
  }
  let hamsters = []

  snapshot.forEach((doc) => {
    const data = doc.data()
    data.id = doc.id
    hamsters.push(data)
  })
  console.log('Dina hamstrar: ' + hamsters)
  res.status(200).send(hamsters)
})

//GET - Hämta en slumpad hamster
router.get('/random', async (req, res) => {
  const colRef = collection(db, 'hamsters')
  const snapshot = await getDocs(colRef)

  if (snapshot.empty) {
    res.status(400).send('400 - Bad hamster request')
    return
  }

  let hamsters = []

  snapshot.forEach((doc) => {
    const data = doc.data()
    data.id = doc.id
    hamsters.push(data)
  })
  const random = Math.floor(Math.random() * hamsters.length)
  res.status(200).send(hamsters[random])
  console.log('Slumpad hamster: ', hamsters[random])
})

//GET - Hämta hamster med ID
router.get('/:id', async (req, res) => {
  let id = req.params.id
  const docRef = doc(colRef, id)
  const snapshot = await getDoc(docRef)
  const data = snapshot.data()

  if (snapshot.exists()) {
    console.log(data)
    res.status(200).send(data)
    return
  } else res.status(404).send('404 - Hamster not found')
})

//POST - Lägg till ny hamster
router.post('/', async (req, res) => {
  let newHamster = req.body

  const hamsterObject = {
    name: req.body.name,
    age: req.body.age,
    favFood: req.body.favFood,
    loves: req.body.loves,
    imgName: req.body.imgName,
    wins: req.body.wins,
    defeats: req.body.defeats,
    games: req.body.games,
  }

  if (Object.keys(newHamster).length === 0) {
    res.status(400).send('400 - Bad hamster request')
    return
  } else {
    const newDocRef = await addDoc(colRef, hamsterObject)
    res.status(200).send({ hamsterObject, id: newDocRef.id })
  }
})

//PUT - ändra befintlig hamster
router.put('/:id', async (req, res) => {
  let oldHamster = req.params.id

  let newHamster = req.body

  const oldDocRef = doc(colRef, oldHamster)

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    console.log('Hamstern finns inte')
    res.status(400).send('400 - Bad hamster request')
    return
  }

  if (oldHamster === 'id-does-not-exist') {
    console.log('Hamstern hittades inte')
    res.status(404).send('404 - Hamster not found')
    return
  }
  await updateDoc(oldDocRef, newHamster)
  res.status(200).send('200 - Hamstern ändrad')
})

//DELETE - ta bort befintlig hamster
router.delete('/:id', async (req, res) => {
  let deleteHamster = req.params.id
  const docRef = doc(colRef, deleteHamster)
  if (deleteHamster === 'id-does-not-exist') {
    res.status(404).send('404 - Hamster not found')
    return
  } else await deleteDoc(docRef)
  res.status(200).send('200 - Hamstern raderad')
})

export default router
