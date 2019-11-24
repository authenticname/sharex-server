const Server = require('sharex-server');

new Server({
        password: process.env.PASSWORD,
        path: process.env.UPLOADS_PATH,
        port: 80,
        fileLength: process.env.LENGTH
})