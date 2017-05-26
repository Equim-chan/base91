'use strict';

const { encode, decode, EncodeStream, DecodeStream } = require('..');
const crypto = require('crypto');
const fs = require('fs');

describe('base91 basic', () => {
  it('should Hello World!', () => {
    expect(decode(encode('Hello World!'), 'utf8')).toBe('Hello World!');
  });

  it('should check input type and filter', () => {
    expect(() => encode()).toThrow();
    expect(() => encode(null, 'utf8')).toThrow();
    expect(() => encode('abc', 'zzzzz')).toThrow();

    expect(encode('')).toBe('');
    expect(encode(2333)).toEqual(encode('2333'));
    expect(encode(0)).toEqual(encode('0'));

    expect(decode(2333)).toEqual(decode('2333'));
    expect(decode()).toEqual(decode(''));  // instead of 'undefined'
  });

  it('should return correct type', () => {
    expect(typeof encode('basE91 is awesome!')).toBe('string');
    expect(typeof encode(Buffer.from([0xff, 0x16, 0xe3, 0x00]))).toBe('string');
    expect(typeof encode(2333)).toBe('string');

    expect(decode('>OwJh>Io0Tv!8PE')).toBeInstanceOf(Buffer);
    expect(decode('')).toBeInstanceOf(Buffer);
    expect(decode(4666)).toBeInstanceOf(Buffer);
    expect(decode()).toBeInstanceOf(Buffer);
  });

  it('should handle ascii Strings input', () => {
    for (let i = 0; i < 100; i++) {
      const raw = crypto.randomBytes(Math.random() * 1000 | 0).toString('base64');
      const encoded = encode(raw);
      expect(encoded).toMatch(/^[\x00-\x7F]*$/);
      expect(decode(encoded).toString()).toBe(raw);
    }
  });

  it('should handle non-ascii Strings input', () => {
    [
      '「やっぱり……いい女には、たばこと屋上と……そしてヒラヒラ服だわね……」——水上由岐',
      '「宁赴常流而葬乎江鱼腹中耳。又安能以皓皓之白，而蒙世之温蠖乎？」——屈原',
      '「さやかちゃん、大好きだ！(*^ω^*)」——Equim',
      '마녀가 가지고 있는 알.',
      'Им предстоит узнать многое друг о друге, о LeMU и о собственном прошлом.',
      '( ͡° ͜ʖ ͡°)',
    ].forEach(p => {
      expect(p).not.toMatch(/^[\x00-\x7F]*$/);

      let encoded = encode(p);
      expect(encoded).toMatch(/^[\x00-\x7F]*$/);
      expect(decode(encoded, 'utf8')).toBe(p);

      encoded = encode(p, 'ucs2');
      expect(encoded).toMatch(/^[\x00-\x7F]*$/);
      expect(decode(encoded)).toEqual(Buffer.from(p, 'ucs2'));
    });
  });

  it('should handle Buffers input', () => {
    for (let i = 0; i < 100; i++) {
      const raw = crypto.randomBytes(Math.random() * 1000 | 0);
      const encoded = encode(raw);
      expect(encoded).toMatch(/^[\x00-\x7F]*$/);
      expect(decode(encoded)).toEqual(raw);
    }
  });

  it('should handle specified encoding', () => {
    for (let i = 0; i < 25; i++) {
      const raw = crypto.randomBytes(Math.random() * 1000 | 0);
      const encoded = encode(raw.toString('base64'), 'base64');
      expect(encoded).toMatch(/^[\x00-\x7F]*$/);
      expect(decode(encoded)).toEqual(raw);
    }
    for (let i = 0; i < 25; i++) {
      const raw = crypto.randomBytes(Math.random() * 1000 | 0);
      const encoded = encode(raw.toString('base64'), 'base64');
      expect(encoded).toMatch(/^[\x00-\x7F]*$/);
      expect(decode(encoded, 'hex')).toBe(raw.toString('hex'));
    }
    for (let i = 0; i < 25; i++) {
      const raw = crypto.randomBytes(Math.random() * 1000 | 0);
      const encoded = encode(raw.toString('hex'), 'hex');
      expect(encoded).toMatch(/^[\x00-\x7F]*$/);
      expect(decode(encoded)).toEqual(raw);
    }
    for (let i = 0; i < 25; i++) {
      const raw = crypto.randomBytes(Math.random() * 1000 | 0);
      const encoded = encode(raw.toString('hex'), 'hex');
      expect(encoded).toMatch(/^[\x00-\x7F]*$/);
      expect(decode(encoded, 'base64')).toBe(raw.toString('base64'));
    }
  });

  it('should skip invalid characters in decoding', () => {
    expect(decode(`qXz'I;W/Hl虚空“T<MnuP n%\n"\\TD”dl(2VK,^]@qU2u   9Mbps5_1rg''-----'BB`))
      .toEqual(decode('qXzI;W/HlT<MnuPn%"TDdl(2VK,^]@qU2u9Mbps5_1rgBB'));
    expect(decode('   '))
      .toEqual(decode(''));
  });
});

describe('base91 stream', () => {
  it('should Hello World!', (done) => {
    const es = new EncodeStream();
    const ds = new DecodeStream();
    let ret = '';

    es
      .pipe(ds)
      .on('data', (chunk) => ret += chunk.toString())
      .on('end', () => {
        expect(ret).toBe('Hello World!');
        done();
      });

    es.write('Hello');
    es.write(' ');
    es.end('World!');
  });

  it('should handle file streams', (done) => {
    const es = new EncodeStream();
    const ds = new DecodeStream();

    fs
      .createReadStream('package.json')
      .pipe(es)
      .pipe(ds)
      .pipe(fs.createWriteStream('package.json.base91'))
      .on('close', () => {
        const inFile = fs.readFileSync('package.json');
        const outFile = fs.readFileSync('package.json.base91');
        fs.unlinkSync('package.json.base91');
        expect(inFile).toEqual(outFile);
        done();
      });
  });

  it('should encode correctly', (done) => {
    const es = new EncodeStream();
    let ret = '';

    const expectedEncoded = encode(fs.readFileSync('README.md'));

    fs
      .createReadStream('README.md')
      .pipe(es)
      .on('data', (chunk) => ret += chunk)
      .on('end', () => {
        expect(ret).toBe(expectedEncoded);
        done();
      });
  });

  it('should decode correctly', (done) => {
    const ds = new DecodeStream();
    const ret = [];

    const expectedDecoded = fs.readFileSync('index.js');

    ds
      .on('data', (chunk) => ret.push(chunk))
      .on('end', () => {
        expect(Buffer.concat(ret)).toEqual(expectedDecoded);
        done();
      });

    const encoded = encode(fs.readFileSync('index.js'));
    ds.end(encoded);
  });

  it('should handle empty stream', async () => Promise.all([
    new Promise((resolve, reject) => {
      const es = new EncodeStream();
      let ret = '';
      es
        .on('data', (chunk) => ret += chunk)
        .on('error', reject)
        .on('end', () => {
          expect(ret).toBe('');
          resolve();
        })
        .end();
    }),
    new Promise((resolve, reject) => {
      const ds = new DecodeStream();
      const ret = [];
      ds
        .on('data', (chunk) => dsRet.push(chunk))
        .on('error', reject)
        .on('end', () => {
          expect(Buffer.concat(ret)).toEqual(Buffer.from(''));
          resolve();
        })
        .end();
    }),
  ]));

  it('should skip invalid characters in decoding', (done) => {
    const ds = new DecodeStream();
    const ret = [];

    ds
      .on('data', (chunk) => ret.push(chunk))
      .on('end', () => {
        expect(Buffer.concat(ret)).toEqual(decode('qXzI;W/HlT<MnuPn%"TDdl(2VK,^]@qU2u9Mbps5_1rgBB'));
        done();
      });

    ds.end(`qXz'I;W/Hl虚空“T<MnuP n%\n"\\TD”dl(2VK,^]@qU2u   9Mbps5_1rg''-----'BB`);
  });
});
