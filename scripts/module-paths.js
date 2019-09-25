const path = require('path');

function getModulePaths() {
  return {
    internal: path.join(__dirname, '../..', 'api-internal-contract-js'),
    external: path.join(__dirname, '../..', 'api-external-js'),
    platform: path.join(__dirname, '../..', 'api-platform-js'),
    get paths()  {
      // Currently, the build command (yarn yarn-cmd build) relies
      // on this order remaining the same - so that the internal project is 
      // always built first.  Do not change the order unless adding 
      // a separate build script to enforce internal is built first.
      return [this.internal, this.external, this.platform];
    }
  };
}

module.exports = getModulePaths;
