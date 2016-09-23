# node-boilerplate
This package provides base functionality for ES6 Node projects.

## Installation
`npm install --save git+https://github.com/pmarrapese/node-boilerplate`

## Usage
### App
The `App` class provides bootstrapping and logging functionality.
To use, extend the `App` class and implement an entry point function named `run`. 
Additionally, you may define `before` and `after` functions to run immediately before or after `run`. 
All functions may be regular functions or a generator functions (useful for yielding promises).

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
The `Config` class provides JSON file parsing/writing and default configuration functionality.
To use, instantiate the `Config` class with a source object or JSON file path. The instance will be the merged result of the provided configuration and the default configuration (if specified).


#### API
##### constructor(_[source]_)
| Parameter            | Description            |
|----------------------|------------------------|
| [source] _{object&#124;string}_   | Object or path to JSON file

Instantiate a configuration object from an object or JSON file.

By default, load `config.json` from the current working directory.

#### parseJSONFile(_[path]_)
| Parameter            | Description            |
|----------------------|------------------------|
| [path] _{string}_   | Path to JSON file

Parse a JSON file.

#### resolveConfigPath(path)
| Parameter            | Description            |
|----------------------|------------------------|
| path _{string}_   | Path to config file

Resolve a configuration file path.

An absolute or relative path may be provided. Relative paths are relative to the current working directory.

- If `path` is not provided, append the default config directory with the default config filename.
- If `path` is provided and is suffixed with a path separator, assume `path` is a directory and append the default config filename.
- In any other case, assume `path` is a path to a file.

#### write(_[path]_)
| Parameter            | Description            |
|----------------------|------------------------|
| [path] _{string}_   | Path to JSON file

Write this object as a JSON file.

If `path` is not provided, write to the the file this object was initially loaded from.

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