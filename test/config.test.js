"use strict";

const Config = require('../').Config;
const _ = require('lodash');
const Path = require('path');
const fs = require('fs');
const os = require('os');

describe('Config', function() {
  describe('Read', function() {
    it('should instantiate empty object by default', function() {
      let config = new Config();
      config.should.be.a('object');
    });

    it('should instantiate config from object', function() {
      let config = new Config({
        foo: 'bar'
      });

      config.should.be.a('object');
      config.foo.should.eq('bar');
    });

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

    it('should allow default values to be overridden and load the default config file', function() {
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

    it('should apply default values recursively', function() {
      class TestConfig extends Config {
        get defaultConfig() {
          return {
            'foo': {
              'yip': 'yap'
            }
          };
        }
      }

      let config = new TestConfig({
        'foo': {
          'bar': 'baz'
        }
      });
      
      config.foo.bar.should.eq('baz');
      config.foo.yip.should.eq('yap');
    });
  });

  describe('Write', function() {
    function validateAndReset(path, number) {
      let config = new Config(path);
      config.random.should.eq(number);
      delete config.random;
      config.write();

      config = new Config(path);
      _.isEmpty(config).should.be.true;
    }

    it('should rewrite loaded config to source', function() {
      let path = './test/fixtures/config/writableConfig.json';
      let config = new Config(path);
      let random = _.random(0, Number.MAX_SAFE_INTEGER);
      config.random = random;
      let write = () => config.write();
      
      write.should.not.throw(Error);
      validateAndReset(path, random);
    });

    it('should write new config to new file', function() {
      let random = _.random(0, Number.MAX_SAFE_INTEGER);
      let config = new Config({
        random: random
      });

      let tempDir = fs.mkdtempSync(os.tmpdir() + Path.sep);
      let path = tempDir + Path.sep + 'test.json';
      let write = () => config.write(path);

      write.should.not.throw(Error);
      validateAndReset(path, random);
    });
    
    it('should not write if path is unavailable', function() {
      let config = new Config({});
      let write = () => config.write();
      write.should.throw(/no path provided/i);
    });
  });
});