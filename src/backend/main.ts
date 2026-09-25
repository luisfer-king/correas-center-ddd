import 'dotenv/config'
import { createApp } from './app.js'

const app = await createApp()
const port = Number(process.env.API_PORT ?? 3001)
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('API_PORT inválido')
}
try {
  await app.listen({ host: '127.0.0.1', port })
} catch (error) {
  app.log.error(error)
  process.exitCode = 1
}
