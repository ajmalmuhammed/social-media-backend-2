import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import connectDB from './config/db'

const app = express()
dotenv.config()

connectDB

app.get('/hello', (req, res) => {
  res.json({ success: 'Hello world' })
})

app.use('/api', authRoutes)

const port = process.env.PORT || 8000
app.listen(port)
