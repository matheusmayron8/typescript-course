import * as http from 'http'
import Api from './api/api'

const models = require('./models')

const config = require('./config/env/config')() //() Invocação imediata

const server = http.createServer(Api)

models.sequelize.sync().then(() => {
    server.listen(config.serverPort)
    server.on('listening', () => console.log(`Server online on port ${config.serverPort}`))
    server.on('error', (error: NodeJS.ErrnoException) => console.log(`Ocorreu um erro: ${error}`))
})