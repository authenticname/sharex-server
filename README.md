# sharex-server (Node.js)

### Usage

You can use either [Docker](https://hub.docker.com/r/alexthemaster/sharex-server) or run it directly with Node.js.

If you wish to do the latter, make sure to install Node from [here](https://nodejs.org/en) and follow the instructions provided below:

- `npm install sharex-server`
- Use the following code:

```js
const Server = require("sharex-server");
new Server({
  password: "password",
  path: "images",
  port: 6666,
  fileLength: 10,
});
```

### Sharex configuration

- The password is to be set as a header;
- The file form name is to be set to `image`;
- The image uploading endpoint is /api/upload;
- The upload endpoint returns a JSON with a URL link;

### ShareX - Custom uploader settings

![](https://raw.githubusercontent.com/authenticname/sharex-server/master/assets/01.png)

![](https://raw.githubusercontent.com/authenticname/sharex-server/master/assets/02.png)
