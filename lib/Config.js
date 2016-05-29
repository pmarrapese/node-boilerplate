"use strict";

const _ = require('lodash');
const FileSystem = require('fs');
const Path = require('path');

const DEFAULT_CONFIG_DIRECTORY = '.';
const DEFAULT_CONFIG_FILENAME = 'config.json';
const DEFAULT_CONFIG = {};

class Config {
  /**
   * Instantiate a configuration object from an object or JSON file.
   * 
   * By default, load `config.json` from the current working directory.
   * 
   * @param {Object|String} [source] -- object or path to JSON file
   * @throws {Error} on read or parse failure
   */
  constructor(source) {
    let config;

    if (_.isObject(source)) {
      config = source;
    } else {
      try {
        config = this.parseJSONFile(source);

        Object.defineProperty(this, '__path', {
          value: this.resolveConfigPath(source)
        });
      } catch (e) {
        // Only raise error if path was provided, or we couldn't parse the default file.
        // Else, the default config file doesn't exist and we're instantiating a default object.
        if (!_.isUndefined(source) || /failed to parse/i.test(e.message)) {
          throw e;
        }
      }
    }


    _.defaults(this, config, this.defaultConfig);
  }

  /**
   * Parse a JSON file.
   *
   * @param {String} [path] -- path to JSON file
   * @return {Object} -- parsed file
   * @throws {Error} on read or parse failure
   */
  parseJSONFile(path) {
    path = this.resolveConfigPath(path);

    let json;

    try {
      json = FileSystem.readFileSync(path);
    } catch (e) {
      throw new Error(`Failed to read file ${path} from disk.`, e.stack || e.message || e);
    }

    try {
      return JSON.parse(json);
    } catch (e) {
      throw new Error(`Failed to parse config file ${path} as JSON.`, e.stack || e.message || e);
    }
  }

  /**
   * Resolve a configuration file path.
   *
   * An absolute or relative path may be provided. Relative paths are relative to the current working directory.
   *
   * - If `path` is not provided, append the default config directory with the default config filename.
   * - If `path` is provided and is suffixed with a path separator, assume `path` is a directory and append the default config filename.
   * - In any other case, assume `path` is a path to a file.
   *
   * @param {String} path -- path to config file
   * @return {String} resolved path
   */
  resolveConfigPath(path) {
    path = path || Path.join(this.defaultConfigDirectory, this.defaultConfigFilename);

    if (path.substr(-1) == Path.sep) {
      // A directory was provided, append default config filename.
      path = Path.join(path, this.defaultConfigFilename);
    }

    return Path.resolve(path);
  }

  /**
   * Write this object as a JSON file.
   *
   * If `path` is not provided, write to the the file this object was initially loaded from.
   *
   * @param {String} [path] -- path to JSON file
   * @throws {Error} on write failure
   */
  write(path) {
    path = path || this.__path;

    if (!path) {
      throw new Error('No path provided.');
    }

    let json = JSON.stringify(this);

    try {
      FileSystem.writeFileSync(path, json);
    } catch (e) {
      throw new Error(`Failed to write to file ${path}.`, e.stack || e.message || e);
    }
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