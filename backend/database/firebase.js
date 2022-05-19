// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

//Require-funktionen finns inte om man använder "import"
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

let firebaseConfig
if (process.env.PRIVATE_KEY) {
  firebaseConfig = JSON.parse(process.env.PRIVATE_KEY)
} else {
  firebaseConfig = require('./firebaseConfig.json')
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

//Exporterar databas-objektet
export { db }
