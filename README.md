# s23-ESN-SB1

YOU ARE *NOT* PERMITTED TO SHARE THIS REPO OUTSIDE THIS GITHUB ORG. YOU ARE *NOT* PERMITTED TO FORK THIS REPO UNDER ANY CIRCUMSTANCES. YOU ARE *NOT* PERMITTED TO CREATE ANY PUBLIC REPOS INSIDE THE CMUSV-FSE ORGANIZATION.  YOU SHOULD HAVE LINKS FROM THIS README FILE TO YOUR PROJECT DOCUMENTS, SUCH AS YOUR REST API SPECS AND YOUR ARCHITECTURE DOCUMENT. *IMPORTANT*: MAKE SURE TO CHECK AND UPDATE YOUR LOCAL GIT CONFIGURATION IN ORDER TO MATCH YOUR LOCAL GIT CREDENTIALS TO YOUR SE-PROJECT GITHUB CREDENTIALS (COMMIT USING THE SAME EMAIL ASSOCIATED WITH YOUR GITHUB ACCOUNT): OTHERWISE YOUR COMMITS WILL NOT BE INCLUDED IN GITHUB STATISTICS AND REPO AUDITS WILL UNDERESTIMATE YOUR CONTRIBUTION. 

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
  * Ender frontend folder, and run yarn
  * Run yarn dev, then you are good to go
