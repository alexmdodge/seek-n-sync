/**
 *  _    __               _                ____                      
 * | |  / /__  __________(_)___  ____     / __ )__  ______ ___  ____ 
 * | | / / _ \/ ___/ ___/ / __ \/ __ \   / __  / / / / __ `__ \/ __ \
 * | |/ /  __/ /  (__  ) / /_/ / / / /  / /_/ / /_/ / / / / / / /_/ /
 * |___/\___/_/  /____/_/\____/_/ /_/  /_____/\__,_/_/ /_/ /_/ .___/ 
 *                                                          /_/      
 * Bumps version of specific files within the package
 * for readability and cross-checking purposes.
 */
var fs = require('fs');
var shell = require('shelljs');
var bump = require('bump-regex');

// Ensure git directory clean
var command = '[[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] && echo "*"';
if ( shell.exec(command).code === 0) {
  console.log('You have uncommitted changes. Please clean then try again.');
  process.exit(-1);
}

// Update the file list with all desired version files
var fileList = [
  './index.js',
]

// There could be an options object for reach file depending
// on version specificity
var options = {
  type: process.argv[2],
  key: 'version',
}

// Loop through each file in the list, pass it through the bump
// function, then return the result
fileList.forEach(file => fs.readFile(file, 'utf8', (err, data) => {
  if ( err ) {
    console.log(`Error: ${err}`);
  } else {
    options.str = data;

    // Bump version of all the strings
    bump(options, (err, out) => {
      if ( err) {
        console.log(`Error: ${err}`);
      } else {
        fs.writeFile(file, out.str, err => {
          if (err) {
            console.log(`Error: ${err}`);
          } else {
            console.log(`File bumped: ${file}`);
          }
        });
      }
    });
  }
}));