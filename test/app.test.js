"use strict";

const App = require('../').App;

describe('App', function() {
  it('should throw exception if no entry point function declared', function() {
    function runApp() {
      class TestApp extends App { }
      new TestApp();
    }

    runApp.should.throw(/not a function/i);
  });

  it('should execute entry point function (regular function)', function() {
    class TestApp extends App {
      run() {
        this.ran = true;
      }
    }

    let app = new TestApp();
    app.ran.should.be.true;
  });

  it('should execute entry point function (generator)', function() {
    class TestApp extends App {
      *run() {
        this.ran = true;
      }
    }

    let app = new TestApp();
    app.ran.should.be.true;
  });

  it('should log messages', function() {
    function testLogs() {
      class TestApp extends App {
        run() {
          this.log('hello world');
        }
      }

      new TestApp();
    }

    testLogs.should.not.throw(Error);
  });
});