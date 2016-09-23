# Changelog
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## v0.0.3 - 2016-09-23
### Added
- Deep object inspection for logging

### Fixed
- Fixed config file not writing to default config path when no path was passed to `write`  

## v0.0.2 - 2016-05-29
### Added
- `before` and `after` hooks for App
- Support for creating Config instances from objects
- Support for writing JSON files from Config instances

### Fixed
- Do not raise exception if Config is instantiated without a path, but default config file does not exist
- Apply default configuration values recursively

## v0.0.1 - 2016-05-17
- Initial release