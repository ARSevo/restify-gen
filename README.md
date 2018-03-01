[![NPM Version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/badge/restify--gen-1.0.3-blue.svg
[npm-url]: https://www.npmjs.com/package/restify-gen

## Installation

```sh
$ npm install -g restify-gen
```

## Quick Start

The quickest way to get started with restify-gen is to utilize the executable `restify-gen` to generate an api application as shown below:

Create the app:

```bash
$ restify-gen myappfolder
```

Install dependencies:

```bash
$ cd myappfolder

$ npm install
```

Start your app at `http://localhost:8080/`:

```bash
$ npm start
```

## Command Line Options

This generator can also be further configured with the following command line flags.

    -V, --version                          output the version number
    -n, --appname <appname>                api application name (default <applicationfolder>)
    -d, --appdescription <appdescription>  api application description (default My API Description)
    -v, --apiversion <apiversion>          api version (default 1.0.0)
    -p, --port <port>                      api port (default 8080)
    -f, --force                            clear contents of the application folder if exists
    -h, --help                             output usage information

## License

[MIT](LICENSE)