"use strict";

const _ = require('lodash');
const FileSystem = require('fs');
const Path = require('path');

const DEFAULT_CONFIG_DIRECTORY = '.';
const DEFAULT_CONFIG_FILENAME = 'config.json';
const DEFAULT_CONFIG = {};

class Config {
  /**
   * Instantiate a configuration object from a JSON file.
   * 
   * An absolute or relative path may be provided. Relative paths are relative to the current working directory.
   *
   * - If `path` is not provided, load the default file from the default directory.
   * - If `path` is provided and is suffixed with a path separator, assume `path` is a directory and load the default file from it.
   * - In any other case, assume `path` is a path to a file.
   * 
   * @param {String} [path] -- path of configuration JSON file
   * @throws {Error} on read or parse failure
   */
  constructor(path) {
    path = path || Path.join(this.defaultConfigDirectory, this.defaultConfigFilename);

    if (path.substr(-1) == Path.sep) {
      // A directory was provided, append default config filename.
      path = Path.join(path, this.defaultConfigFilename);
    }

    try {
      var config = FileSystem.readFileSync(path);
    } catch (e) {
      throw new Error(`Failed to read config file ${path} from disk.`, e.stack || e.message || e);
    }
    
    try {
      config = JSON.parse(config);
    } catch (e) {
      throw new Error(`Failed to parse config file ${path} as JSON.`, e.stack || e.message || e);
    }

    _.defaults(this, config, this.defaultConfig);
  }

  /**
   * Return the default config directory.
   * This may be overridden to influence the behavior of the constructor.
   *
   * @return {String}
   */
  get defaultConfigDirectory() {
    return DEFAULT_CONFIG_DIRECTORY;
  }

  /**
   * Return the default config filename.
   * This may be overridden to influence the behavior of the constructor.
   *
   * @return {String}
   */
  get defaultConfigFilename() {
    return DEFAULT_CONFIG_FILENAME;
  }

  /**
   * Return the default config object.
   * This may be overridden to influence the behavior of the constructor.
   *
   * @return {Object}
   */
  get defaultConfig() {
    return DEFAULT_CONFIG;
  }
}

module.exports = Config;