const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');

const config = require('./config.json');
const package = require('../package.json');

const app = express();
app.use(fileUpload());

(async function () {
    await fs.ensureDir(__dirname + '/' + config.directory)
})();

if (config.directory === '/') config.directory = '';
if (config.directory.startsWith('/')) config.directory = config.directory.replace('/', '');
if (!config.len) config.len = 10;

const directory = config.directory ? `${config.directory}/` : '';

let generated = false;

app.get(`/${directory}:img`, async (req, res) => {
    const file = await fs.exists(`${__dirname}/${directory}${req.params.img}`);
    if (!file) return res.status(404).end();
    res.sendFile(`${__dirname}/${directory}${req.params.img}`)
});

app.get('/generatesxcu', async (req, res) => {
    if (generated || await fs.exists(`${__dirname}/openMe.sxcu`)) return res.status(403).end();
    try {
        await fs.writeFile(`${__dirname}/openMe.sxcu`, JSON.stringify({
            "Version": "12.4.1",
            "RequestMethod": "POST",
            "RequestURL": `${req.protocol}://${req.get('host')}/api/upload`,
            "Body": "MultipartFormData",
            "Headers": {
                "password": config.password
            },
            "FileFormName": "img",
            "URL": "$json:url$"
        }))
        generated = true;
        res.status(200).send(`done! you can open your file by navigating to ${__dirname}/openMe.sxcu`);
    } catch (err) { res.status(500).send(err).end(); }

});

app.get('*', (req, res) => {
    return res.status(404).send(`this server is running ${package.name} by ${package.author.toLowerCase()}`).end();
});

app.post('/api/upload', async (req, res) => {
    if (!req.headers.password || req.headers.password !== config.password) return res.status(403).send('invalid pass').end();

    if (req.files.img && (/\.(gif|jpg|jpeg|tiff|png)$/i).test(req.files.img.name)) {
        try {
            const string = await generateString(config.len).catch(error => { console.error(error); throw error; });
            await fs.writeFile(`./${directory}${string}.png`, req.files.img.data);
            res.status(200).send({
                url: `${req.protocol}://${req.get('host')}/${directory}${string}.png`
            })

        }
        catch (err) { res.status(500).send(err).end(); }
    } else res.status(500).end();

});

async function generateString(length, tries = 0) {

    if (tries >= 100) throw new Error('tried 100 string combinations for a file, but all of them are already taken. I suggest cleaning older images!')

    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
    let final = '';

    for (let i = 0; i < length; i++) {
        final += possible[Math.floor(Math.random() * possible.length)]
    }

    const exists = await fs.exists(`${__dirname}/${directory}${final}.png`);
    if (exists) return generateString(length, ++tries);

    return final;
}

const PORT = process.env.PORT || config.PORT || 60;
app.listen(PORT, () => console.log(`${package.name} started on port ${PORT}`))