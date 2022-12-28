# Manual build

Navigate to this folder and build the Docker image using: `docker build -t sharex-server .`

After installation, you can simply run the following command to start the server: `docker run -d --env PASSWORD=somePassword --env UPLOADS_PATH=not/my/nudes --env LENGTH=10 -p 80:80 sharex-server`
