# BetterEDU_WebApp

1. To get started, make sure that you have ssh key enabled in your system. In order to do this, open a commandline window and run this command: ```ssh-keygen -t rsa -b 4096 -C "you@example.com"```, where you would replace the email with the email associated with your github account. This will generate two files: id_rsa, which is private, and id_rsa.pub, which is a public key which you will add to your github account. Now add the ssh key to the ssh agent by running the following commands: ```eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa```. Now copy the ssh public key to the clipboard by running this command: ```pbcopy < ~/.ssh/id_rsa.pub```. If you do not have pbcopy available, then you can also use the ```cat``` command with the id_rsa.pub file to manually copy its contents.

2. Now go to your github profile settings and navigate to the SSH Keys section. Here click on "New SSH Key" -> add a descriptive title such as betteredu key -> paste the public key into the "Key" field -> click "Add SSH Key". Now you can test if your ssh connection is setup correctly by running ```ssh -T git@github.com``` which should result in this message: "Hi your_username! You've successfully authenticated, but GitHub does not provide shell access."

3. Update your repository's remote URL to support SSH by running this in your terminal/commandline: ```git remote set-url origin git@github.com:your-username/BetterEDU_WebApp.git```, where you can access the URL by selecting Code and then copying the SSH link as shown here: 
<img width="1013" alt="Screenshot 2024-09-21 at 4 33 11 PM" src="https://github.com/user-attachments/assets/111b0d70-957c-4b4c-8f0b-3d1021592ffe">

4. To clone the repository, you can run ```git clone git@github.com:your-username/BetterEDU_WebApp.git``` in your local environment. This should prompt you to enter a passphrase for your user, which would be the password for your computer login (basically like if you were using the ```sudo``` command in order to use admin priviledges for a task).

5. Now you should be able to access and run the code! Make sure that you have Node and Postgres installed prior to running the app. Then you should install any dependencies that are needed by navigating into the server directory and running ```npm install```, and also doing the same in the client directory. To start the backend, you have to run ```nodemon index``` when you have navigated to the server directory inside the BetterEDU_WebApp directory. To start the frontend, run ```npm start``` when you have navigated to the client directory.

6. WIP: Since the database is not connected to Jesse's remote database yet, you do have to create the database locally - run the sql queries inside of database.sql inside of your local postgres db in order to do so. You will also have to add sample data which I can add to the database.sql script in the future (unlikely because it should be connected to the remote db by then hopefully). 
