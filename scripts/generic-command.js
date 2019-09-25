const modulePaths = require('./module-paths')();
const cp = require('child_process');
const colors = require('colors');

runCommand = (command, directory) => {
  cp.execSync(command, {
    cwd: directory,
    stdio:[0,1,2]
  });
}

// Parse out the git command to be run in each directory
// We use the --command to indicate that all subsequent parameters are meant for git
// This is to support one day having parameters that are meant for this script
// If we don't find --command, then all parameters are meant for git.
// The first two parameters are node and the path to this file
var idx = 2;
for (var i=0; i<process.argv.length; ++i) {
    if (process.argv[i] == "--command") {
        idx = i + 1;
        break;
    }
}

if (process.argv.length <= idx) {
    throw new Error("A parameter is required to indicate what command to run");
}

var command = process.argv.slice(idx).join(' ');

for (let dir of modulePaths.paths) {
    console.log(colors.green('Running ' + command + ' on ' + dir));
    runCommand(command, dir);
    console.log(colors.green('========================================'));
}

console.log(colors.green('Successfully ran ' + command + ' on all projects'));
