"use strict";

const co = require('co');
const _ = require('lodash');
const util = require('util');

const DEFAULT_OPTIONS = {
  isDebugging: false
};

class App {
  /**
   * Initialize the application.
   *
   * @param {Object} [options] -- application options
   * @param {Boolean} [options.isDebugging=false] -- whether to enable debugging
   * @throws {Error} on initialization failure
   */
  constructor(options) {
    _.defaultsDeep(this, options, DEFAULT_OPTIONS);

    if (!_.isFunction(this.run)) {
      throw new Error('No "run" function declared.');
    }

    co(function*() {
      if (_.isFunction(this.before)) {
        yield co(this.before.bind(this));
      }

      yield co(this.run.bind(this));

      if (_.isFunction(this.after)) {
        yield co(this.after.bind(this));
      }
    }.bind(this)).catch(this.die.bind(this));
  }

  /**
   * Log a message.
   *
   * @param {...*} [arguments] -- arbitrary number of arguments
   */
  log() {
    let args = _.map(arguments, (arg) => {
      if (_.isObject(arg)) {
        return util.inspect(arg, {
          depth: null,
          colors: true
        });
      }

      return arg;
    });

    let time = new Date().toTimeString().split(' ', 1)[0];
    args.unshift(`[${time}]`);
    console.log.apply(this, args);
  }

  /**
   * If debugging is enabled, log a message.
   *
   * @param {...*} [arguments] -- arbitrary number of arguments
   */
  debug() {
    if (!this.isDebugging) {
      return;
    }

    let args = _.map(arguments, argument => argument);
    args.unshift('[DEBUG]');
    this.log.apply(this, args);
  }

  /**
   * Log a message and terminate the process.
   *
   * @param {...*} [arguments] -- arbitrary number of arguments
   */
  die() {
    let args = _.map(arguments, argument => argument);
    args.unshift('[FATAL ERROR]');
    this.log.apply(this, args);
    process.exit(1);
  }
}

module.exports = App;