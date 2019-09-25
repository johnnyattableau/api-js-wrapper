const modulePaths = require('./module-paths')();
const cp = require('child_process')
const colors = require('colors');

console.log(colors.cyan('Watching for compilation of all projects'));

compileWatchCommand = (path) => {
  console.log(colors.cyan(`Running "yarn compile-watch" in '${path}'`));
  cp.spawn('yarn', ['compile-watch'], {
    cwd: path,
    stdio:[0,1,2],
    shell: true
  }, () => console.log(`Exited for ${project}`));
}

compileWatchCommand(modulePaths.internal);

// Because the external and platform projects are dependent on the
// internal project, this helps us avoid a timing issue where
// the external and platform projects cannot find the internal project.
setTimeout(() => {
  compileWatchCommand(modulePaths.external);
  compileWatchCommand(modulePaths.platform);
}, 10000);
