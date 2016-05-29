"use strict";

const Config = require('../').Config;

describe('Config', function() {
  it('should load valid config file', function() {
    let config = new Config('./test/fixtures/config/goodConfig.json');

    config.should.be.a('object');
    config.hello.should.eq('world');
  });

  it('should not load invalid config file', function() {
    function loadBadConfig() {
      let config = new Config('./test/fixtures/config/badConfig.json');
    }

    loadBadConfig.should.throw(/failed to parse/i);
  });

  it('should not load missing config file', function() {
    function loadBadConfig() {
      let config = new Config('./test/fixtures/config/this-file-should-never-exist.json');
    }

    loadBadConfig.should.throw(/failed to read/i);
  });

  it('should allow default values to be overridden', function() {
    class TestConfig extends Config {
      get defaultConfigDirectory() {
        return './test/fixtures/config/';
      }

      get defaultConfigFilename() {
        return 'goodConfig.json';
      }

      get defaultConfig() {
        return { 'foo': 'bar' };
      }
    }

    let config = new TestConfig();
    config.should.be.a('object');
    config.hello.should.eq('world');
    config.foo.should.eq('bar');
  });
});