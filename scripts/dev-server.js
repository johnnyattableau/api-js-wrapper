// This is a very simple server which can be used to serve up an in-progress development version or the
// last released version of the Extension API js lib, the desktop bootstrap lib, and the Examples 
// folder here. Useful for testing

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs-extra');
const modulePaths = require('./module-paths')();

const externalProjectPath = modulePaths.external;
const platformProjectPath = modulePaths.platform;

const currentReleaseVersion = process.argv[2] === '--current-release';

const extensionVersion = require(path.join(externalProjectPath, 'package.json'));
const extensionVersionNumber = currentReleaseVersion ? extensionVersion.lastReleaseVersion: extensionVersion.version;

app.get('/extensions-api.js', function (req, res) {
  const extensionApiPath = path.join(externalProjectPath, `dist-extensions/tableau.extensions.${extensionVersionNumber}.js`);
  console.log('loading...' + extensionApiPath);
  res.sendFile(extensionApiPath);
});

app.get('/desktop-bootstrap.js', function (req, res) {
  const bootstrapPath = path.join(platformProjectPath, 'dist/api-platform-js.js');
  const bootstrapContents = fs.readFileSync(bootstrapPath, {encoding: 'utf8'});

  // We need to inject in a call to trigger bootstrapping for now since we aren't injecting this
  res.send(bootstrapContents.concat('\n\nwindow._tryExtensionsDesktopBootstrap();'));
});

app.get('/favicon.ico', function (req, res) {
  res.send('');
});

// Just serve up the rest of this project in a static file way
app.use(express.static('.'));

const port = process.env.EXTENSIONS_PORT || 7755;
console.log(`Listening on port ${port}`);
console.log('Pres Ctrl+c to quit');
app.listen(port);
