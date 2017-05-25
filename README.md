# base91
[![npm version](https://img.shields.io/npm/v/node-base91.svg?style=flat)](https://www.npmjs.com/package/node-base91)
[![Build Status](https://img.shields.io/travis/Equim-chan/base91.svg?style=flat)](https://travis-ci.org/Equim-chan/base91)
[![Coverage Status](https://img.shields.io/coveralls/Equim-chan/base91.svg?style=flat)](https://coveralls.io/github/Equim-chan/base91?branch=master)
[![Codacy Badge](https://img.shields.io/codacy/grade/9f4a3b6990134a7b9c5fe099dfb41bcd.svg?style=flat)](https://www.codacy.com/app/Equim-chan/base91)
[![license](https://img.shields.io/npm/l/node-base91.svg?style=flat)](https://github.com/Equim-chan/base91/blob/master/LICENSE)

basE91 codec implemented in pure JavaScript.

Migrated from the C and PHP version of Joachim Henke's [basE91](http://base91.sourceforge.net/).

## Installation
```bash
$ npm i --save node-base91
# Or
$ yarn add node-base91
```

## Usage
### Encoding
```js
const base91 = require('node-base91');
const fs = require('fs');

// accept string with utf8 encoding by default
const encodedText = base91.encode('Hello World!');
console.log(encodedText);  //=> >OwJh>Io0Tv!8PE

// accept string with specified encoding
const encodedUnicodeText = base91.encode('Hello World!', 'ucs2');
console.log(encodedUnicodeText);  //=> .AoE~l*hy(bAgA;DDn6yF"NAyA&AA

// accept Buffer
const encodedFile = base91.encode(fs.readFileSync('sayaka.jpg'));

// convert hex into base91
const encodedHash = base91.encode('ecfbfc2754db0c408223fa7917116867420ef60d', 'hex');
console.log(encodedHash);  //=> y>)~Q7e.XL{xWWXI#WJ2CKy>A
```

### Decoding
```js
const base91 = require('node-base91');

// with `encoding`, `decode` will return a string
const decodedText = base91.decode('>OwJh>Io0Tv!8PE', 'utf8');
console.log(decodedText);  //=> Hello World!

// without `encoding`, `decode` will return a buffer
const decodedBuffer = base91.decode('>OwJh>Io0Tv!8PE');
console.log(decodedBuffer);  //=> <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64 21>

// convert base91 into hex
const decodedHash = base91.decode('y>)~Q7e.XL{xWWXI#WJ2CKy>A', 'hex');
console.log(decodedHash);  //=> ecfbfc2754db0c408223fa7917116867420ef60d
```

## API
### encode(data[, encoding = 'utf8'])
* data (`String` | `Buffer`) - Data to be encoded, can be either `String` or `Buffer`.
* encoding (`String`) - The encoding of `data` string. Default: `'utf8'`. This argument is ignored when `data` is already a `Buffer`.
* returns (`String`) - basE91 encoded string.

### decode(data[, encoding])
* data (`String`) - basE91 string to be decoded.
* encoding (`String`) - The string encoding of decoded data. If `encoding` is not specified, it will return a `Buffer`.
* returns (`String` | `Buffer`) - Decoded buffer or string.

## Test
```bash
$ npm test
# Or
$ yarn test
```

## Benchmark
```bash
$ npm run benchmark
# Or
$ yarn run benchmark
```

My result:
```
$ node benchmark
[control group] dataGen 1KB x 40,423 ops/sec ±6.05% (73 runs sampled)
basE91 encoding 1KB x 9,622 ops/sec ±6.69% (77 runs sampled)
basE91 decoding 1KB x 2,331 ops/sec ±1.80% (87 runs sampled)
[control group] dataGen 512KB x 105 ops/sec ±2.27% (76 runs sampled)
basE91 encoding 512KB x 10.57 ops/sec ±8.06% (29 runs sampled)
basE91 decoding 512KB x 3.56 ops/sec ±7.38% (13 runs sampled)
[control group] dataGen 1MB x 49.04 ops/sec ±3.65% (62 runs sampled)
basE91 encoding 1MB x 4.32 ops/sec ±7.59% (16 runs sampled)
basE91 decoding 1MB x 1.54 ops/sec ±8.93% (8 runs sampled)
[control group] dataGen 4MB x 12.14 ops/sec ±6.25% (32 runs sampled)
basE91 encoding 4MB x 0.63 ops/sec ±19.91% (6 runs sampled)
basE91 decoding 4MB x 0.39 ops/sec ±11.51% (6 runs sampled)
=============================================
Tested with Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz x4 under win32 x64 10.0.15063
Avg basE91 encode speed: 6,549.076 KB/s
Avg basE91 decode speed: 3,097.487 KB/s
```

## TODO
* [ ] Support for stream.

## License
[BSD 3-clause](https://github.com/Equim-chan/base91/blob/master/LICENSE)
