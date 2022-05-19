// Importera npm-paket och moduler
import express from 'express'
import cors from 'cors'
import path from 'path'
const app = express()
import hamsters from './routes/hamsters.js'

//Fixar dist-problemet
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log('directory-name ', __dirname)
console.log(path.join(__dirname, '/dist', 'index.html'))

// Konfiguration
const PORT = process.env.PORT || 1188
const distPath = path.join(__dirname, '/../dist/')
console.log('distpath:', distPath)

// Middleware
// CORS öppnar vårt projekt så det kan användas från andra domäner
app.use(cors())
app.use(express.json())

// Parse request body
app.use(express.urlencoded({ extended: true }))

// Logger - skriv ut information om inkommande request
app.use((req, res, next) => {
  console.log(`Logger: ${req.method}  ${req.url} `, req.body)
  next()
})
// '/' -> dist/index.html'
app.use(express.static(distPath))
// '/img/hamster-14.jpg' -> './hamsterImages/hamster-14.jpg'
app.use('/img', express.static(path.join(__dirname, '/hamsterImages/')))

// Endpoints
app.use('/hamsters', hamsters)

// Övriga endpoints, för att fungera med React Router i frontend
app.all('*', (req, res) => {
  res.sendFile(distPath + 'index.html')
})

// Starta server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`)
})
