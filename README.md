# Technologies Used
* Express.js
* TypeScript
* TypeORM
* Socket.IO
* JSONWebToken
* TailwindCSS
* Parcel
# How to setup run the whole app
* Ensure you have docker installed on your machine
* After install docker, run docker-compose --file docker-compose-dev.yml up --build -d
* Then open http://localhost:1234 to see the result


# How to set up dev environment
* Ensure you have nodejs, python3, and Docker installed
* For backend dev
  * Fire up container using docker-compose --file docker-compose-dev.yml up --build -d db
  * Enter backend folder, and run yarn and yarn dev
  * You are good to go
* For frontend dev
  * Fire up containers using docker-compose --file docker-compose-dev.yml up --build -d db api
  * Enter frontend folder, and run yarn
  * Run yarn dev, then you are good to go
* Make sure your code can pass the CI
