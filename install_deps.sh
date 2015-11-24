#!/bin/sh

clear
echo
echo "***** Installing jsRPi Node Dependencies *****"
echo
echo

# Update NPM
sudo npm cache clean
sudo npm update -g

# Install global pacakges first.
sudo npm install grunt-cli -g
sudo npm install webpack -g
sudo npm install npm-check-updates -g

# Install developer dependencies.
sudo npm install grunt --save-dev
sudo npm install grunt-contrib-clean --save-dev
sudo npm install grunt-contrib-jshint --save-dev
sudo npm install grunt-jsdoc --save-dev
sudo npm install grunt-jsdoc-ng --save-dev
sudo npm install jshint --save-dev
sudo npm install nodeunit --save-dev
sudo npm install grunt-webpack --save-dev
sudo npm install node-loader --save-dev

# Install project dependencies.
# NOTE: To install pi-spi (SPI library for Node.js and Raspberry Pi),
# the package installer builds the native library from source using
# node-gyp.  Node-gyp requires python v >= 2.5 and < 3.0.  So
# you must have python >= 2.5 installed and if you have python
# 3.x installed, we must specify which python to use to npm before
# attempting to install pi-spi.
sudo npm install underscore --save
sudo npm install timespan --save
sudo npm install string-builder --save
sudo npm install convert-string --save
sudo npm config set python python2.7
sudo npm install pi-spi --save

# Make sure all dependenices are up to date.
# They should already be after the above install
# statements, but this will also make sure package.json
# is properly upgraded too.
sudo ncu -u

echo
echo
echo "**** Module Installation Complete *****"
exit