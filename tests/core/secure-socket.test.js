const SecureSocket = require('../../lib/core/secure-socket');
const cipher = require('../../lib/core/cipher');

describe('secure socket test', function () {
    let testCipher = cipher.createCipher('uuYVdm/Xr2DLiyo96xGqWAIl25+3CJcuEzhm0BTvj+dZ/qMn3P1ktuP6HJSnm4gW9/EXoHCrMfWKcUnRrAfVTnzWvMzJL88L1Olyacc3+SaTtNLhePK/bAFVDOyzOUT0nf87LQo+KB6G+13tgzpnDk9KwQ2V6kJu3kzGINqR8xvCnD9ToeA07ol1rTKotXpNhFI1lgADyCuezjaAjmhrIrmMdFrk9pkfY1emd3n8kmUh0yTKrgRLsJDEfqV/GDNA8BC9Q2IppIXlYbhWR1Td2NlGmKkjgglbzTCHD31I6F9cXh2NsaIsGWpRRRKBUG17mr4FxUHiw8Bzu/gGPBrfsg==');
    let secureSocket = new SecureSocket(testCipher);
    let encode;
    let decode;
    test("encodeBuffer test",()=>{
        let encode = secureSocket.encodeBuffer(Buffer.from([0x01,0x02]));
        expect(Buffer.isBuffer(encode)).toBe(true);
        expect(encode.length).toBe(2);
        expect(encode[0]).toBeLessThan(256);
        expect(encode[1]).toBeLessThan(256);
    })
    test("decodeBuffer test",()=>{
        encode = secureSocket.encodeBuffer(Buffer.from([0x01,0x02]));
        decode = secureSocket.decodeBuffer(encode);
        expect(Buffer.isBuffer(decode)).toBe(true);
        expect(decode.length).toBe(2);
        expect(decode[0]).toBe(0x01);
        expect(decode[1]).toBe(0x02);
    })
});