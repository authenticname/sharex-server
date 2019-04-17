# private-sharex-server (NodeJS)

*warning: I made this code a while ago, and only added to it recently, so this might not be the most efficient one ever*

### Requirements
- [Node.js](https://nodejs.org/en)

### Usage
- Clone or download this repository
- Open a terminal in the folder created
- Run `npm install`
- CD into the `src` folder using `cd src`
- Edit the [config.example.json](./src/config.example.json) file and rename it to `config.json`
- Run `node index.js`
- Enjoy!

FYI, the application will generate a `.sxcu` file that you can open, so no settings will have to be done! (this has to be done by visiting `server:port/generatesxcu/`, so the server knows it's protocol, port etc.)

### Config File
`password` - that password that's going to be used to authentificate the ShareX client with the server

`directory` (optional) - the directory your images will get saved to (example: `uploads`, this will automatically lead to the public URL being `server:port/uploads/`)

`PORT` (optional) - the port the web server will run on (defaults to 60)

`len` (optional) - the maximum length of a filename (defaults to 10)

Example: 
```json 
{
    "password": "aPassword",
    "directory": "uploads",
    "PORT": null,
    "len": 10
}
```