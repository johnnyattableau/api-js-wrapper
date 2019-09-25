// This simple script is used to bundle together the resources which make the old
// Extensions API which includes the desktop bootsrap and external code

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const modulePaths = require('./module-paths')();

// Pull in the platform and invoke the bootstrap
var Platform = require(modulePaths.platform + '/lib/src/JsApiPlatform');
window._tryExtensionsDesktopBootstrap();

// Assign the external stuff to window.tableau
window.tableau = require(modulePaths.external + './lib/src/ExtensionsApi');
