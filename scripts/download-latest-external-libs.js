'use strict';

let request = require('request');
let fs = require('fs');
let packagejson =  require('../package.json');
let baseArtifactoryUrl = packagejson.downloadLibConfig.artifactory;
let lastModifiedQuery = baseArtifactoryUrl + 'api/storage/tab-npm-local/@tableau/api-external-js?lastModified';
let direc = '/../release-{0}';
let libsToDownload = [
  {
    url: baseArtifactoryUrl + 'tab-npm-local/%40tableau/api-external-js/-/%40tableau/api-external-js-{0}.tgz!/package/dist-extensions/tableau.extensions.{0}.js',
    location: __dirname + direc + '/tableau.extensions.{0}.js'
  },
  {
    url: baseArtifactoryUrl + 'tab-npm-local/%40tableau/api-external-js/-/%40tableau/api-external-js-{0}.tgz!/package/dist-extensions/tableau.extensions.{0}.min.js',
    location: __dirname + direc + '/tableau.extensions.{0}.min.js'
  }]

new Promise((res, rej) => {
  /* 
   * This artifactory REST API (baseArtifactoryUrl) returns a link to a description of the last modified library. 
   * The "uri" key contains a version that we can remove and use to get the specified version of the actual library.
  */
  request({
    url: lastModifiedQuery,
    json: true
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res(body.uri);
    }
  });
}).then((result) => {
  // Parse the version number and fetch the libs
  let version = getVersionFromLastModified(result);
  fs.mkdir(__dirname + formatString(direc, version) , { recursive: true }, (err) => {
    // Don'Mot throw an error here. Trying to create an existing directory will throw an error in which case we continue.
    if (err){
      console.warn(err);
    } 

    for (let i in libsToDownload) {
      request({
        url: formatString(libsToDownload[i]['url'], version),
        json: true
      }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            fs.writeFile(formatString(libsToDownload[i]['location'], version), body, (err) => {
              if (err){ 
                throw err;
              }
            });     
        } else {
          console.log('Error: ', error); 
          console.log('StatusCode: ', response && response.statusCode); 
          console.log('Body: ', body); 
        }
      });
    }
  });
 });


function getVersionFromLastModified(lastModifiedLink) {
  return lastModifiedLink.match(new RegExp('[0-9]+\.[0-9]+\.[0-9]+\-[a-zA-Z\.]*[0-9]+'));
}

function formatString() {
  let result = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    result = result.replace(new RegExp('\\{' + (i - 1) + '\\}', 'g'), arguments[i]);
  }
  return result;
}
