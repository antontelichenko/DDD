module.exports = {
    apiPort: 8001,
    staticPort: 8000,
    pgConfig: {
        host: '127.0.0.1',
        port: 5432,
        database: 'example',
        user: 'anton',
        password: '412315',
    },
    transport: 'http',
    customLogger: false,
    framework: 'fastify'
}

// 'fastify''native'