# base91
[![npm version](https://img.shields.io/npm/v/node-base91.svg?style=flat)](https://www.npmjs.com/package/node-base91)
[![Build Status](https://img.shields.io/travis/Equim-chan/base91.svg?style=flat)](https://travis-ci.org/Equim-chan/base91)
[![Coverage Status](https://img.shields.io/coveralls/Equim-chan/base91.svg?style=flat)](https://coveralls.io/github/Equim-chan/base91?branch=master)
[![Codacy Badge](https://img.shields.io/codacy/grade/9f4a3b6990134a7b9c5fe099dfb41bcd.svg?style=flat)](https://www.codacy.com/app/Equim-chan/base91)
[![license](https://img.shields.io/npm/l/node-base91.svg?style=flat)](https://github.com/Equim-chan/base91/blob/master/LICENSE)

basE91 codec implemented in pure JavaScript.

It is migrated from the C and PHP version of Joachim Henke's [basE91](http://base91.sourceforge.net/)

## Installation
```bash
$ npm i --save node-base91
```

## Usage
### Encoding
```js
const base91 = require('node-base91');

const encoded = base91.encode('Hello World!');
console.log(encoded);  // >OwJh>Io0Tv!8PE
```

### Decoding
```js
const base91 = require('node-base91');

const decoded = base91.decode('Jo9Kc)qCH$/xaxHl3o=Cq/6Y%y|u=EuiKBs3O:FZ<R4tM.kL5D^g66nNxS*/{B[p^iwJL,&elTR;axLmeBMf,W?NxS,/},kLxo>vm)UI97?+5E{ouA');
console.log(decoded.toString('utf8'));  // Any application that can be written in JavaScript, will eventually be written in JavaScript.
```

## API
### encode(data)
* data (`String` | `Buffer`) - data to be encoded, if it is a `String`, it will be casted into `Buffer` with utf-8 encoding automatically.
* returns (`String`) - basE91 encoded string.

### decode(data)
* data (`String`) - basE91 string to be decoded.
* returns (`Buffer`) - decoded buffer.

## Test
```bash
$ npm test
```

## Benchmark
```bash
$ npm run benchmark
```

My result:
```
Tested with Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz x4 under win32 x64 10.0.15063
Avg basE91 encode speed: 7,807.844 KB/s
Avg basE91 decode speed: 2,749.869 KB/s
```

## TODO
* [ ] Support for stream.

## License
[BSD 3-clause](https://github.com/Equim-chan/base91/blob/master/LICENSE)
