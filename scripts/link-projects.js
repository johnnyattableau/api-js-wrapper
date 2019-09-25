const modulePaths = require('./module-paths')();
const cp = require('child_process');
const colors = require('colors');

runCommand = (command, directory) => {
  cp.execSync(command, {
    cwd: directory,
    stdio:[0,1,2]
  });
}

runCommand('yarn link', modulePaths.internal);
runCommand('yarn link @tableau/api-internal-contract-js', modulePaths.external);
runCommand('yarn link @tableau/api-internal-contract-js', modulePaths.platform);

console.log(colors.green('Successfully linked the projects together'));
