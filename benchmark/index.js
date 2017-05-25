'use strict';

const { encode, decode } = require('..');
const Benchmark = require('benchmark');
const crypto = require('crypto');
const os = require('os');

const dataGen1k = () => crypto.randomBytes(1024);
const dataGen512k = () => crypto.randomBytes(524288);
const dataGen1m = () => crypto.randomBytes(1048576);
const dataGen4m = () => crypto.randomBytes(4194304);

const suite = new Benchmark.Suite;

suite
  .add('[control group] dataGen 1KB', dataGen1k)
  .add('basE91 encoding 1KB', () => encode(dataGen1k()))
  .add('basE91 decoding 1KB', () => decode(encode(dataGen1k())))
  .add('[control group] dataGen 512KB', dataGen512k)
  .add('basE91 encoding 512KB', () => encode(dataGen512k()))
  .add('basE91 decoding 512KB', () => decode(encode(dataGen512k())))
  .add('[control group] dataGen 1MB', dataGen1m)
  .add('basE91 encoding 1MB', () => encode(dataGen1m()))
  .add('basE91 decoding 1MB', () => decode(encode(dataGen1m())))
  .add('[control group] dataGen 4MB', dataGen4m)
  .add('basE91 encoding 4MB', () => encode(dataGen4m()))
  .add('basE91 decoding 4MB', () => decode(encode(dataGen4m())))
  .on('cycle', (e) => console.log(e.target.toString()))
  .on('complete', function () {
    const encodeSpeed1k = 1 / (1 / this[1].hz - 1 / this[0].hz);
    const decodeSpeed1k = 1 / (1 / this[2].hz - 1 / this[1].hz);
    const encodeSpeed512k = 1 / (1 / this[4].hz - 1 / this[3].hz);
    const decodeSpeed512k = 1 / (1 / this[5].hz - 1 / this[4].hz);
    const encodeSpeed1m = 1 / (1 / this[7].hz - 1 / this[6].hz);
    const decodeSpeed1m = 1 / (1 / this[8].hz - 1 / this[7].hz);
    const encodeSpeed4m = 1 / (1 / this[10].hz - 1 / this[9].hz);
    const decodeSpeed4m = 1 / (1 / this[11].hz - 1 / this[10].hz);

    const encodeSpeed = (encodeSpeed4m * 4096 +
      encodeSpeed1m * 1024 +
      encodeSpeed512k * 512 +
      encodeSpeed1k) / 4;
    const decodeSpeed = (decodeSpeed4m * 4096 +
      decodeSpeed1m * 1024 +
      decodeSpeed512k * 512 +
      decodeSpeed1k) / 4;

    const cpus = os.cpus();

    console.log([
      '='.repeat(45),
      'Tested with ' + cpus[0].model + ' x' + cpus.length + ' under ' + os.platform() + ' ' + os.arch() + ' ' + os.release(),
      'Avg basE91 encode speed: ' + encodeSpeed.toLocaleString() + ' KB/s',
      'Avg basE91 decode speed: ' + decodeSpeed.toLocaleString() + ' KB/s',
    ].join('\n'));
  })
  .run({ 'async': true });
