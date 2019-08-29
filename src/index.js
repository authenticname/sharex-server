const polka = require('polka');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const path = require('path');

const formatREGEX = /\.(gif|jpg|jpeg|tiff|png)$/i;

const middlewares = {
    // Easy way to set a status of a response
    status: function (req, res, next) {
        res.status = function (code) {
            this.setHeader('status', code);
            return this;
        };

        return next();
    }
}

/**
 * @class
 */
class Server {
    /**
     * @constructor
     * @param {Object} config
     * @param {String} config.password The password
     * @param {String} config.path The path the uploads will be stored
     * @param {Number} config.port The port the server will be running on
     * @param {Number} config.fileLength The desired length of the file name
     */
    constructor(config = { password: "1234", path: "uploads", port: 6060, fileLength: 10 }) {
        this._password = config.password;
        this._path = this.parsePath(config.path);
        this._port = config.port;
        this._fileLength = config.fileLength;

        this._folder = path.dirname(require.main.filename);

        this._server = null;
        this._init()
    }

    /**
     * @private
     */
    async _init() {
        // Make sure the directory the uploads will go in exists
        await fs.ensureDir(this._folder + this._path)
        

        // Server setup
        this._server = polka();
        this._server.use(fileUpload());
        this._server.use(middlewares.status);
        this._server.listen(this._port, () => console.log(`[Server] ShareX server started on port ${this._port}`));

        this._routes();
    }

    /**
     * @private
     */
    _routes() {

        // Serve the image, if it exists
        this._server.get(this._path + ':img', async (req, res) => {

            // Check if the file exists
            const exists = await fs.exists(this._folder + this._path + req.params.img);
            if (!exists) return res.status(404).end('Image not found');

            const [, format] = formatREGEX.exec(req.params.img);
            if (format === 'gif') res.writeHead(200, { "Content-Type": "image/gif" });
            else res.writeHead(200, { "Content-Type": "image/png" });
            return fs.createReadStream(this._folder + this._path + req.params.img).pipe(res);
        });

        // Handle the uploading
        this._server.post('/api/upload', async (req, res) => {

            // Checks
            if (!req.headers.password || req.headers.password !== this._password) return res.status(403).end('No password / Wrong password provided.');
            if (!req.files.image || !formatREGEX.test(req.files.image.name)) return res.status(403).end('Please provide a valid image.');

            // Generate a string
            const string = await this.string(this._fileLength).catch(error => { throw new Error(error) });

            const [, type] = formatREGEX.exec(req.files.image.name);

            // Try to save the file
            try {
                await fs.writeFile(this._folder + this._path + string + (type === 'gif' ? '.gif' : '.png'), req.files.image.data);
                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ URL: `${req.connection.encrypted ? 'https://' : 'http://'}${req.headers.host}${this._path}${string}.${type}` }))
            } catch (err) {
                return res.status(500).end('Something went wrong, try again later.');
            }
        });

        this._server.get('*', (req, res) => res.status(403).end())
    }

    /**
     * Parse the path to work with the server (remove additional slash characters / symbols)
     * @param {String} path
     * @returns {String}
     * @example "/uploads/images/"
     */
    parsePath(path) {
        const removerRegex = /([-!$%^&*()_+|~=`{}\[\]:";'<>?,.@#])|^\/|\/$/g;
        path = path.replace(removerRegex, '');
        return `/${path}${!path.length ? '' : '/'}`;
    }

    /**
     * Generate a random string to use for the file name
     * @param {Number} length The desired length of the file
     * @returns {Promise<String | Error>}
     */
    async string(length = 10, tries = 0) {
        if (tries >= 100) throw 'Tried 100 string combinations for a file, but all of them are already taken. I suggest cleaning older images!';

        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
        let final = '';

        for (let i = 0; i < length; i++) {
            final += possible[Math.floor(Math.random() * possible.length)]
        }

        const exists = await fs.exists(`${this._folder}${this._path}${final}.png`);
        if (exists) return this.string(length, ++tries);

        return final;
    }
}

module.exports = Server;