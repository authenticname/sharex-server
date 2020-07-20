# sharex-server (NodeJS)

## 🗒️ The easiest way to run sharex-server is to use our Docker solution ([which you can find here](https://github.com/authenticname/sharex-server/tree/master/docker)). If you want to manually run it, continue reading!


### ⚙️ Requirements
- [Node.js](https://nodejs.org/en)

### Usage
- `npm install sharex-server`
- Use the following code:
```js
const Server = require('sharex-server');

new Server({
        password: 'password',
        path: 'definitely/not/my/nudes',
        port: 6666,
        fileLength: 10
})
```
- Enjoy

The password is to be set as a header;

The file form name is to be set to `image`;

The image uploading endpoint is /api/upload;

The upload endpoint returns a JSON with a URL link;

### ShareX - Custom uploader settings

![](https://raw.githubusercontent.com/authenticname/sharex-server/master/assets/01.png)
![](https://raw.githubusercontent.com/authenticname/sharex-server/master/assets/02.png)