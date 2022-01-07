If you are on Windows
1) Please download MongoDB Community Edition (version 5.0): https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
Pleaes make sure to also download mongosh after downloading MongoDB. (instructions for downloading both files are in the same provided link)

If you are on Linux
1) Choose a recommended installation method for MongoDB (version 5.0): https://docs.mongodb.com/manual/administration/install-on-linux/

If you are on Mac
1) Please first download MongoDB Community Edition (version 5.0):https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
You may have to run mongosh as a service before staring the project. In my case, I did not have to, but could be different depending on your model and/or OS version.

2) Please also install NodeJS LTS: https://nodejs.org/en/ , this should install npm along with Node, which is required for this project.
3) Open up a Terminal and cd into the folder: Backend. Run the command: npm install (this installs required npm modules locally).
4) Then in the same folder (Backend), run command: npm run devStart (this will start backend server). wait until you see "db connected" in the console and then keep it running
5) Open up a new Terminal and cd into the folder: Frontend/project. Run the command: npm install (this installs required npm modules locally).
6) Then in the same folder (Frontend/project), run command: npm start (this will start frontend server) and keep it running.
this should automatically open up the project in you default browser. if not, open your browser and type in http://localhost:3000/

7) To stop the app, use control + c (on mac) on both terminals.


****** If you want to use the account that was used in the demo, the email is email1@gmail.com, and the password is Password1?