import { appMode, env, loadedEnvFile } from './config/env'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import morgan from 'morgan'
import { Server } from 'socket.io'
import { connectDB } from './config/db.config'
import { authRouter } from './routes/auth.route'
import { roomRouter } from './routes/room.route'
import { setupSocketHandlers } from './socket'
import { socketAuthMiddleware } from './middlewares/socket-auth.middleware'
import config from './config/url.config'

const app = express()
const PORT = 5000
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: config.clientUrl, credentials: true } })

// global
app.set('io', io)
app.use(cors({ credentials: true, origin: config.clientUrl }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('tiny'))

// route middlewares
app.use('/api/auth', authRouter)
app.use('/api/room', roomRouter)

// health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ message: 'Server is running', uptime: process.uptime() })
})

// socket auth middleware
io.use(socketAuthMiddleware)

// socket init
setupSocketHandlers(io)

async function start() {
  await connectDB()

  server.listen(PORT, () => {
    const dbReady = mongoose.connection.readyState === 1
    console.log('---')
    console.log(`HTTP server listening on port ${PORT}`)
    console.log(`Mode: ${appMode} (NODE_ENV=${process.env.NODE_ENV ?? 'undefined'})`)
    console.log(`Env file: ${loadedEnvFile}`)
    console.log(`MongoDB: ${dbReady ? 'connected' : 'not connected'} (readyState=${mongoose.connection.readyState})`)
    console.log(`MONGO_URI: ${env.MONGO_URI}`)
    console.log('---')
  })
}

start().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})
