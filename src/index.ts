import express from 'express'
import dotenv from 'dotenv'
import profileRoutes from './routes/profile-routes'
import userPostRoutes from './routes/user-post-routes'
import authRoutes from './routes/auth-routes'
import { initializeDB } from './config/db-config'
import { errorMiddleware } from './middlewares/error'
import { initMailer } from './config/mailer-config'
import { envVariables } from './config/initilize-env-variables-config'
import cookieParser from 'cookie-parser'
const app = express()

initializeDB()

app.get('/hello', (req, res) => {
  res.json({ success: 'Hello world' })
})
app.use(express.json())
app.use(cookieParser())

app.use('/api', authRoutes)
app.use('/api', profileRoutes)
app.use('/api', userPostRoutes)
app.use(errorMiddleware)
initMailer()

const port = envVariables.PORT || 8000
app.listen(port, () => {
  console.log('App started on ', port)
})
