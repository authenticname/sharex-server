# Configuration
First of all, `git clone` this repository. 

After cloning, navigate to the folder and build the Docker image using: `docker build -t sharex-server .` (you only do this ONCE!)

After installation, you can simply run the following command to start the server: `docker run -d --env PASSWORD=somePassword --env UPLOADS_PATH=not/my/nudes --env LENGTH=10 -p 80:80 sharex-server`

*Setting the environment variables is optional, but recommended. The default's are as follows: `PASSWORD=password, UPLOADS_PATH=/uploads, LENGTH=10`.<br>
The `-p 80:80` part of the command binds the host computer's port 80 to the container's 80 port and the `-d` flag runs this instance detached.*