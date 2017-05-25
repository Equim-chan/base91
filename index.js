'use strict';

const table = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '#', '$',
  '%', '&', '(', ')', '*', '+', ',', '.', '/', ':', ';', '<', '=',
  '>', '?', '@', '[', ']', '^', '_', '`', '{', '|', '}', '~', '"',
];

/**
 * Encode data to basE91, where data can be `String` or `Buffer`.
 *
 * @param  {String | Buffer} data - data to be encoded
 * @return {String} - basE91 encoded string
 * @api public
 */
exports.encode = (data) => {
  if (data == null) {
    throw new Error('Missing argument');
  }
  const raw = Buffer.from(typeof data === 'number' ? data.toString() : data);
  const len = raw.length;
  let ret = '';

  let n = 0;
  let b = 0;

  for (let i = 0; i < len; i++) {
    b |= raw[i] << n;
    n += 8;

    if (n > 13) {
      let v = b & 8191;
      if (v > 88) {
        b >>= 13;
        n -= 13;
      } else {
        v = b & 16383;
        b >>= 14;
        n -= 14;
      }
      ret += table[v % 91] + table[v / 91 | 0];
    }
  }

  if (n) {
    ret += table[b % 91];
    if (n > 7 || b > 90) ret += table[b / 91 | 0];
  }

  return ret;
};

/**
 * Decode basE91 string to Buffer.
 *
 * @param  {String} data - data to be decoded
 * @return {Buffer} - original data
 * @api public
 */
exports.decode = (data) => {
  const raw = '' + (data || '');
  const len = raw.length;
  let ret = [];

  let b = 0;
  let n = 0;
  let v = -1;

  for (let i = 0; i < len; i++) {
    /**
     * I also intended to use a `dectab` but also beaten by benchmark:
     * table.indexOf x 2,926,486 ops/sec ±2.28% (86 runs sampled)
     * dectab[] x 489,775 ops/sec ±1.32% (92 runs sampled)
     */
    const p = table.indexOf(raw[i]);
    if (p === -1) continue;
    if (v < 0) {
      v = p;
    } else {
      v += p * 91;
      b |= v << n;
      n += (v & 8191) > 88 ? 13 : 14;
      do {
        ret.push(b & 0xff);
        b >>= 8;
        n -= 8;
      } while (n > 7);
      v = -1;
    }
  }

  if (v > -1) {
    ret.push((b | v << n) & 0xff);
  }

  return Buffer.from(ret);
};
