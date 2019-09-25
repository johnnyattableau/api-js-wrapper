const modulePaths = require('./module-paths')();
const cp = require('child_process');
const colors = require('colors');

runCommand = (command, directory, ignoreFailure) => {
  try {
    cp.execSync(command, {
      cwd: directory,
      stdio:[0,1,2]
    });
  } catch(e) {
    if (!ignoreFailure) {
      throw e;
    }
  }
}

runCommand('yarn unlink', modulePaths.internal, true);
runCommand('yarn unlink @tableau/api-internal-contract-js', modulePaths.external, true);
runCommand('yarn', modulePaths.external, true);
runCommand('yarn link @tableau/api-internal-contract-js', modulePaths.platform, true);
runCommand('yarn', modulePaths.platform, true);

console.log(colors.green('Successfully unlinked all of the projects'));
