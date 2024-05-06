'use strict'

const dev = {
    app: {
        port: Process.env.DEV_APP_PORT || 3000
    },
    db: {
        host: Process.env.DEV_DB_HOST || 'localhost',
        port: Process.env.DEV_DB_PORT || 27017,
        name: Process.env.DEV_DB_NAME || 'shopDev'
    }
}

const pro = {
    app: {
        port: Process.env.PRO_APP_PORT || 3000
    },
    db: {
        host: Process.env.PRO_DB_HOST || 'localhost',
        port: Process.env.PRO_DB_PORT || 27017,
        name: Process.env.PRO_DB_NAME || 'shopPro'
    }
}
const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]