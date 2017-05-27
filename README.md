# base91
[![npm version](https://img.shields.io/npm/v/node-base91.svg?style=flat)](https://www.npmjs.com/package/node-base91)
[![Build Status](https://img.shields.io/travis/Equim-chan/base91.svg?style=flat)](https://travis-ci.org/Equim-chan/base91)
[![Coverage Status](https://img.shields.io/coveralls/Equim-chan/base91.svg?style=flat)](https://coveralls.io/github/Equim-chan/base91?branch=master)
[![Codacy Badge](https://img.shields.io/codacy/grade/9f4a3b6990134a7b9c5fe099dfb41bcd.svg?style=flat)](https://www.codacy.com/app/Equim-chan/base91)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
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
const encodedFile = base91.encode(fs.readFileSync('../../sayaka.jpg'));

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

### Stream
```js
const base91 = require('node-base91');
const fs = require('fs');

// encoding
fs
  .createReadStream('package.json')
  .pipe(new base91.EncodeStream())
  .pipe(fs.createWriteStream('package.json.base91'))
  .on('close', () => {
    console.log(fs.readFileSync('package.json.base91', 'utf8'));
    //=> sd:CAYEIW$iwyCAMlref_f,Hb%&@8YvPM"^Xxp)z7gg .......

    // decoding
    fs
      .createReadStream('package.json.base91')
      .pipe(new base91.DecodeStream())
      .pipe(fs.createWriteStream('package.json.decoded'))
      .on('close', () => {
        const origin = fs.readFileSync('package.json');
        const deEncoded = fs.readFileSync('package.json.decoded');
        console.log(Buffer.compare(origin, deEncoded) === 0); //=> true
      });
  });
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

### new EncodeStream([opt])
* opt (`Object`) - Options are passed to [`new stream.Transform`](https://nodejs.org/dist/latest-v7.x/docs/api/stream.html#stream_new_stream_transform_options)
* returns (`EncodeStream`) - Stream encoder.

### new DecodeStream([opt])
* opt (`Object`) - Options are passed to [`new stream.Transform`](https://nodejs.org/dist/latest-v7.x/docs/api/stream.html#stream_new_stream_transform_options)
* returns (`DecodeStream`) - Stream decoder.

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
[control group] dataGen 1KB x 48,643 ops/sec ±1.91% (84 runs sampled)
basE91 encoding 1KB x 11,941 ops/sec ±1.71% (85 runs sampled)
basE91 decoding 1KB x 3,238 ops/sec ±1.73% (89 runs sampled)
[control group] dataGen 512KB x 112 ops/sec ±1.54% (79 runs sampled)
basE91 encoding 512KB x 12.06 ops/sec ±2.12% (34 runs sampled)
basE91 decoding 512KB x 4.91 ops/sec ±4.12% (17 runs sampled)
[control group] dataGen 1MB x 55.31 ops/sec ±1.98% (69 runs sampled)
basE91 encoding 1MB x 5.19 ops/sec ±4.21% (17 runs sampled)
basE91 decoding 1MB x 2.19 ops/sec ±6.36% (10 runs sampled)
[control group] dataGen 4MB x 12.78 ops/sec ±6.12% (35 runs sampled)
basE91 encoding 4MB x 1.05 ops/sec ±10.33% (7 runs sampled)
basE91 decoding 4MB x 0.43 ops/sec ±9.71% (6 runs sampled)
=============================================
Tested with Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz x4 under win32 x64 10.0.15063
Avg basE91 encode speed: 8,327.687 KB/s
Avg basE91 decode speed: 3,887.838 KB/s
```

## License
[BSD-3-clause](https://github.com/Equim-chan/base91/blob/master/LICENSE)
