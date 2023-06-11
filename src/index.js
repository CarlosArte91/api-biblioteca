import express from 'express'
import cors from 'cors'
import routes from './routes/index.routes.js'
import { PORT } from './config.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', routes)

app.listen(PORT)
console.log('Server running on port', PORT)
