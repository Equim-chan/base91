'use strict';

const { encode, decode } = require('..');
const crypto = require('crypto');

describe('base91 basic', () => {
  it('should Hello World!', () => {
    expect(decode(encode('Hello World!')).toString()).toBe('Hello World!');
  });

  it('should check input type', () => {
    expect(() => encode()).toThrow();
    expect(() => encode(null)).toThrow();

    expect(encode('')).toBe('');
    expect(encode(2333)).toEqual(encode('2333'));
    expect(encode(0)).toEqual(encode('0'));

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
      const encoded = encode(p);
      expect(encoded).toMatch(/^[\x00-\x7F]*$/);
      expect(decode(encoded).toString()).toBe(p);
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

  it('should skip invalid characters in decoding', () => {
    expect(decode(`qXz'I;W/Hl虚空“T<MnuP n%\n"\\TD”dl(2VK,^]@qU2u   9Mbps5_1rg''-----'BB`))
      .toEqual(decode('qXzI;W/HlT<MnuPn%"TDdl(2VK,^]@qU2u9Mbps5_1rgBB'));
    expect(decode('   ')).toEqual(decode(''));
  });
});

describe.skip('base91 stream', () => {
});
