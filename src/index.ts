import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import { initializeDB } from './config/db-config'
import { errorMiddleware } from './middlewares/error'
import { initMailer } from './config/mailer-config'
import { envVariables } from './config/initilize-env-variables-config'

const app = express()

initializeDB()

app.get('/hello', (req, res) => {
  res.json({ success: 'Hello world' })
})
app.use(express.json())
app.use('/api', authRoutes)
app.use(errorMiddleware)
initMailer()

const port = envVariables.PORT || 8000
app.listen(port, () => {
  console.log('App started on ', port)
})
