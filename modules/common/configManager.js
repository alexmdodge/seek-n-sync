const chalk = require('chalk');
const common = require('common-tags');
const utils = require('../common/utils.js');

/**
 * Utility class for managing the configuration object.
 * TODO: Begin mocking architecture and refactor some
 * basic modules.
 * 
 * @class Config
 */
class ConfigManager {
  /**
   * Accepts a configuration object
   * 
   * @static
   * @param {any} conf 
   * @memberof ConfigManager
   */
  static init(conf) {
    // Check that configuration setup properly
    if (!conf) {
      console.log(
        '\n',
        common.stripIndents`
        ${chalk.red(
          'Configuration Error'
        )}: Unable to load configuration. Ensure
        ${chalk.white('.snsrc')} file is present in parent directory.
        `
      );
      throw new Error('Configuration error.');
    } else if (conf.name === null) {
      console.log(
        '\n',
        common.stripIndents`
        ${chalk.red(
          'Configuration Error'
        )}: Please ensure a project name is defined
        in the ${chalk.white('.snsrc')} configuration file.
        `
      );
      throw new Error('Configuration error.');
    } else if (conf.path === null) {
      console.log(
        '\n',
        common.stripIndents`
        ${chalk.red(
          'Configuration Error'
        )}: Please ensure a project path is defined
        in the ${chalk.white('.snsrc')} configuration file.
        `
      );
      throw new Error('Configuration error.');
    } else if (conf.parent_path === null) {
      console.log(
        '\n',
        common.stripIndents`
        ${chalk.yellow(
          'Configuration Warning'
        )}: You have not defined a parent path for your project.
        Please ensure when calling the sync tool to provide a path where the parent project is located.
        `
      );
    }
  }

  /**
   * Accepts a configuration object and outputs configuration
   * state, giving the user options around editing configuration
   * before they continue with the sync
   * 
   * @static
   * @param {any} conf 
   * @returns 
   * @memberof ConfigManager
   */
  static async verify(conf) {
    console.log(
      '\n',
      common.stripIndents`
      ${chalk.bold('Your current configuration is')} :
    `
    );

    let isUnfilled = false;
    let value;
    Object.keys(conf).map(key => {
      if (conf[key] === null) {
        isUnfilled = true;
        value = `${chalk.yellow('Value Undefined')}`;
      } else {
        value = conf[key];
      }
      console.log(`  • ${chalk.white(key)}: ${value}`);
    });

    // If unfilled value, then exit with error
    if (isUnfilled) {
      console.log('\n');
      throw new Error(common.stripIndents`
        You have not specified a parent path. Either pass the parent path to sync through the -p flag, or specify a 
        static path in the ${chalk.white('.snsrc')} configuration file.
      `);
    } else {
      const reader = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
      });

      console.log('');
      console.log(
        'Proceed with sync based on the above configuration? (yes/no)'
      );

      return new Promise((resolve, reject) => {
        reader.prompt('> ');
        reader.on('line', input => {
          if (utils.matchValue(input, ['yes', 'y'])) {
            console.log(
              '\n\t\t--------------- Starting Sync ---------------\n'
            );
            process.stdin.pause();
            resolve(true);
          } else {
            console.log(
              `${chalk.yellow(
                'Exiting sync'
              )}. Please update configuration with desired settings.`
            );
            process.exit(1);
          }
        });
      });
    }
  }
}

module.exports = ConfigManager;
