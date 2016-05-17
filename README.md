# node-boilerplate
This package provides base functionality for ES6 Node projects.

## Installation
`npm install --save git+https://github.com/pmarrapese/node-boilerplate`

## Usage
### App
The `App` class provides bootstrapping and logging functionality.
To use, extend the `App` class and implement an entry point function named `run`.
The entry point function may be a regular function or a generator function (useful for yielding promises).

#### API
##### constructor(_[options]_)
| Parameter            | Description            |
|----------------------|------------------------|
| [options] _{object}_   | Application options
| [options.isDebugging] _{boolean}_ | Whether to enable debugging (default: false)

Initialize the application.

##### log(_[...]_)
Log a message.

##### debug(_[...]_)
If debugging is enabled, log a message.

##### die(_[...]_)
Log a message and terminate the process.

#### Example
The following is a simple application that will retrieve the stats of the current working directory.

```js
"use strict";

const App = require('@pmarrapese/node-boilerplate').App;
const FileSystem = require('fs');

class MyApp extends App {
  *run() {
    try {
      var stats = yield this.getStats(process.cwd());
    } catch (e) {
      this.die('stat failed:', e);
    }

    this.log('stat result:', stats);
  }

  getStats(path) {
    return new Promise((resolve, reject) => {
      FileSystem.stat(path, (err, res) => err ? reject(err) : resolve(res));
    });
  }
}

new MyApp();
```

### Config
The `Config` class provides JSON file parsing and default configuration functionality.
To use, instantiate the `Config` class with a file path. The instance will be the merged result of the default configuration (if specified) and the parsed JSON.

#### API
##### constructor(_[path]_)
| Parameter            | Description            |
|----------------------|------------------------|
| [path] _{string}_   | Path of configuration JSON file

Instantiate a configuration object from a JSON file.

An absolute or relative path may be provided. Relative paths are relative to the current working directory.

- If `path` is not provided, load the default file from the default directory.
- If `path` is provided and is suffixed with a path separator, assume `path` is a directory and load the default file from it.
- In any other case, assume `path` is a path to a file.

##### defaultConfigDirectory (getter)
Return the default config directory. (default: current working directory)
This may be overridden to influence the behavior of the constructor.

##### defaultConfigFilename (getter)
Return the default config filename. (default: `config.json`)
This may be overridden to influence the behavior of the constructor.

##### defaultConfig (getter)
Return the default config object. (default: `{}`)
This may be overridden to influence the behavior of the constructor.

#### Example
Assuming the following `config.json` exists in the current working directory:
```json
{
  "meow": "wow"
}
```

```js
"use strict";

const Boilerplate = require('@pmarrapese/node-boilerplate');
const App = Boilerplate.App;
const Config = Boilerplate.Config;

class MyApp extends App {
  run() {
    let config = new MyConfig();
    this.log(config);
  }
}

class MyConfig extends Config {
  get defaultConfig() {
    return {
      "foo": "bar"
    }
  }
}

new MyApp();
```

will result in the following output:

```
[00:47:12] MyConfig { meow: 'wow', foo: 'bar' }
```

## License
ISC