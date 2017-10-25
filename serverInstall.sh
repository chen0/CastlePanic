#!/bin/bash

# Install Mysql
sudo apt-get update
sudo apt-get install mysql-server

# update mysql settings
sudo cp mysql.cnf /etc/mysql/my.cnf
sudo service mysql start

# Create mysql user/database
setup="CREATE USER 'app'@'localhost' IDENTIFIED BY 'applive';"
setup="${setup} CREATE DATABASE CastlePanicDB;"
setup="${setup} GRANT SELECT, INSERT, UPDATE, DELETE ON CastlePanicDB.* TO 'app'@'localhost';"
echo $setup | mysql -p

# Add Tables
mysql CastlePanicDB < src/server/database/tables.sql -p

# Install Node.js
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

# Install packages
yarn install

# Build Production Code
yarn build:prod

# setup node to run on port 80
sudo apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep /usr/local/bin/node

# Give pm2 permissions
command="$(./node_modules/pm2/bin/pm2 startup ubuntu | tail -n 1)"
eval $command

# start server
sudo ./node_modules/pm2/bin/pm2 start ./dist/server.bundle.js
sudo ./node_modules/pm2/bin/pm2 list