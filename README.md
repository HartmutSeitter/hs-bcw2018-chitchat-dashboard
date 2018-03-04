# ChitChat performance Dashboard

This project is related to the hs-bcw2018-ebike-chitchat project!
In the hs-bcw2018-ebike-chitchat a chitchat conversation bot is implemented and some dialog traces a saved in a cloudant database to analyse the performance of the chitchat application.

The hs-bcw2018 chitchat is based on the React App and for more info see[Create React App](https://github.com/facebookincubator/create-react-app).

## Dependencies 
In a cloudant DB hosted on IBM Cloud, documents must be available. This application will connect to cloudant and retrieve the documents and display it in a table.

## Setup to run it localy
1. Copy the repository data to a local directory
2. execute 'npm install'
3. execute 'npm build run'
4. execute 'npm start

5. insert the correct cloudent credentials in App.js (username, password, url, database name) 

The ChitChat performance dashboard will a program start (componentDidMount) connect to the database and display the documents of the cloudantDB.

The documents have to have the following json keys:
## Cloudant Document structure
1. input.text;
2. output.text;
3. intents[0].intent;
4. intents[0].confidence;
5. date;

## Setup to run the app in IBM Cloud

1. Create a new toolchain in IBM Cloud using DevOps in on the IBM cloud dashboard -- Develop a cloud foundry app
2. Specify a unique name and select create
3. Configure Git Repos -- select Repository type: Clone
4. Check that the Source Repository URL points to the correct Git-Repository
5. Configure the Deliver Pipeline steps (Build and Deliver)
6. In the Build Stage select NPM as Builder type and use the following build script 

#Set up required version of Node and NPM
export NVM_DIR=/home/pipeline/nvm
export NODE_VERSION=7.0.0
export NVM_VERSION=0.33.0

npm config delete prefix \
  && curl https://raw.githubusercontent.com/creationix/nvm/v${NVM_VERSION}/install.sh | sh \
  && . $NVM_DIR/nvm.sh \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && nvm use default \
  && node -v \
  && npm -v

#Install & build
npm install && npm install axios && npm install react-table && npm run build

7. Set Build archive directory to build

8. In the Deploy stage specfie the deploy config appropriate and use the following Deploy Script

#!/bin/bash
# Push app
if ! cf app $CF_APP; then  
  cf push $CF_APP -b https://github.com/cloudfoundry-community/staticfile-buildpack.git 
else
  OLD_CF_APP=${CF_APP}-OLD-$(date +"%s")
  rollback() {
    set +e  
    if cf app $OLD_CF_APP; then
      cf logs $CF_APP --recent
      cf delete $CF_APP -f
      cf rename $OLD_CF_APP $CF_APP
    fi
    exit 1
  }
  set -e
  trap rollback ERR
  cf rename $CF_APP $OLD_CF_APP
  cf push $CF_APP -b https://github.com/cloudfoundry-community/staticfile-buildpack.git 
  cf delete $OLD_CF_APP -f
fi
# Export app name and URL for use in later Pipeline jobs
export CF_APP_NAME="$CF_APP"
export APP_URL=http://$(cf app $CF_APP_NAME | grep urls: | awk '{print $2}')

#Run the Build and Deploy Process and the app should be deployed to the IBM Cloud env. you specified in the Deploy Config