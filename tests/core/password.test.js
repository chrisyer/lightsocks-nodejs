const password = require('../../lib/core/password');

describe('password test', function () {

    test('validate password test',()=>{
       let validPassword = 'uuYVdm/Xr2DLiyo96xGqWAIl25+3CJcuEzhm0BTvj+dZ/qMn3P1ktuP6HJSnm4gW9/EXoHCrMfWKcUnRrAfVTnzWvMzJL88L1Olyacc3+SaTtNLhePK/bAFVDOyzOUT0nf87LQo+KB6G+13tgzpnDk9KwQ2V6kJu3kzGINqR8xvCnD9ToeA07ol1rTKotXpNhFI1lgADyCuezjaAjmhrIrmMdFrk9pkfY1emd3n8kmUh0yTKrgRLsJDEfqV/GDNA8BC9Q2IppIXlYbhWR1Td2NlGmKkjgglbzTCHD31I6F9cXh2NsaIsGWpRRRKBUG17mr4FxUHiw8Bzu/gGPBrfsg==';
       expect(password.validatePassword(validPassword)).toBe(true);
       let invalidPassword = 'invalid-passwordxsxaxa';
       expect(password.validatePassword(invalidPassword)).toBe(false);
    })
    test('get random password',()=>{
        let r = password.generateRandomPassword();
        expect(password.validatePassword(r)).toBe(true);
    })
});
