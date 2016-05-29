"use strict";

const App = require('../').App;

describe('App', function() {
  it('should throw exception if no run function declared', function() {
    function runApp() {
      class TestApp extends App { }
      new TestApp();
    }

    runApp.should.throw(/no "run" function/i);
  });

  it('should execute before, run, and after in order (regular functions)', function() {
    class TestApp extends App {
      before() {
        should.not.exist(this.a);
        should.not.exist(this.b);
        should.not.exist(this.c);
        this.a = true;
      }

      run() {
        this.a.should.be.true;
        should.not.exist(this.b);
        should.not.exist(this.c);
        this.b = true;
      }

      after() {
        this.a.should.be.true;
        this.b.should.be.ok;
        should.not.exist(this.c);
      }
    }

    new TestApp();
  });

  it('should execute before, run, and after in order (generator functions)', function() {
    class TestApp extends App {
      *before() {
        should.not.exist(this.a);
        should.not.exist(this.b);
        should.not.exist(this.c);
        this.a = true;
      }

      *run() {
        this.a.should.be.true;
        should.not.exist(this.b);
        should.not.exist(this.c);
        this.b = true;
      }

      *after() {
        this.a.should.be.true;
        this.b.should.be.ok;
        should.not.exist(this.c);
      }
    }

    new TestApp();
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