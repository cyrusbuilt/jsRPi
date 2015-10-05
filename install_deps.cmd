@echo off
cls
setlocal enableextensions
title jsRPi Dependency Installer
echo.
echo ***** Installing jsRPi Node Dependencies *****
echo.
echo.

:: Update NPM
call npm cache clean
call npm update -g

:: Install global packages first.
call npm install -g grunt-cli
:: call npm install -g mocha

:: Install project dependencies.
:: NOTE: To install pi-spi (SPI library for Node.js and Raspberry Pi),
:: the package installer builds the native library from source using
:: node-gyp.  Node-gyp requires python v >= 2.5 and < 3.0.  So
:: you must have python >= 2.5 installed and if you have python
:: 3.x installed, we must specify which python to use to npm before
:: attempting to install pi-spi.
call npm install extend --save
call npm install underscore --save
call npm install timespan --save
call npm install string-builder --save
call npm install convert-string --save
call npm config set python python2.7
call npm install pi-spi --save

:: Install developer dependencies
call npm install grunt --save-dev
call npm install grunt-contrib-clean --save-dev
call npm install grunt-contrib-concat --save-dev
call npm install grunt-contrib-uglify --save-dev
call npm install grunt-contrib-qunit --save-dev
call npm install grunt-contrib-jshint --save-dev
call npm install grunt-contrib-watch --save-dev
call npm install grunt-jsdoc --save-dev
call npm install grunt-jsdoc-ng --save-dev
call npm install jshint  --save-dev
call npm install qunit --save-dev
:: call npm install chai --save-dev

echo.
echo.
echo **** Module Installation Complete *****
title Command Prompt
endlocal
pause
