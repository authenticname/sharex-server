const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');

const config = require('./config.json');
const package = require('./package.json');

const app = express();
app.set('view engine', 'ejs');
app.use(fileUpload());

(async function() {
    await fs.ensureDir(__dirname + '/' + config.directory)
})();

app.get(`/${config.dir}/:img`, async (req, res) => {
    const file = await fs.exists(`${__dirname}/${config.directory}/${req.params.img}`);
    if (!file) return res.status(404).end();
    res.sendFile(`${__dirname}/${config.dir}/${req.params.img}`)
});

app.get('*', (req, res) => {
    res.status(404);
    res.render('index', {
        title: package.name,
        author: package.author,
    });
    res.end();
});

app.post('/api/upload', async (req, res) => {
    if (!req.headers.password || req.headers.password !== config.password) return res.status(403).send('invalid pass').end();

    if (req.files.img && (/\.(gif|jpg|jpeg|tiff|png)$/i).test(req.files.img.name)) {
        try {
            res.status(200);
            const string = await generateString(config.len);
            await fs.writeFile(`./${config.directory}/${string}.png`, req.files.img.data);
            res.send({
                url: `${req.protocol}://${req.get('host')}/${config.directory}/${string}.png`
            })
        }
        catch (err) { res.status(500).send(err).end(); }
    } else res.status(500).end();

});

async function generateString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
    let final = '';

    for (let i = 0; i < length; i++) {
        final += possible[Math.floor(Math.random() * possible.length)]
    }

    const exists = await fs.exists(`${__dirname}/uploads/${final}.png`);
    if (exists) return await generateString(length);

    return final;
}

app.listen(process.env.PORT || 60, () => console.log(`${package.name} started on port ${process.env.PORT || 60}`))