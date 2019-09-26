import { HelperEncrypt, HelperDecrypt, HashKeyGen } from '../../../src/utils/crypto';

describe('Helper encrypt data', () => {
    it('HelperEncrypt_Text_Encrypted', () => {
        const ENCRYPTED = HelperEncrypt('test');
        expect(ENCRYPTED).toBeDefined();
        expect(typeof ENCRYPTED).toBe('string');
        expect(ENCRYPTED.split(':').length).toBe(2);
        expect(ENCRYPTED).toMatch(/^[a-zA-Z0-9\:]+$/);
    });

    it('HelperEncrypt_TextAndHashKey_Encrypted', () => {
        const ENCRYPTED = HelperEncrypt('test', 'gLgk8Nt7ograVzCsgQz1JM05QJtpzDbk');
        expect(ENCRYPTED).toBeDefined();
        expect(typeof ENCRYPTED).toBe('string');
        expect(ENCRYPTED.split(':').length).toBe(2);
        expect(ENCRYPTED).toMatch(/^[a-zA-Z0-9\:]+$/);
    });
});

describe('Helper decrypt data', () => {
    it('HelperDecrypt_Text_Decrypted', () => {
        const DECRYPTED = HelperDecrypt(
            'd7d55bbcb445c253ddcfbdabc1c8b832:8d400c3bc883b4222364f2561b3948b3',
        );
        expect(DECRYPTED).toBeDefined();
        expect(typeof DECRYPTED).toBe('string');
        expect(DECRYPTED).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('HelperDecrypt_TextAndHashKey_Decrypted', () => {
        const DECRYPTED = HelperDecrypt(
            'd7d55bbcb445c253ddcfbdabc1c8b832:8d400c3bc883b4222364f2561b3948b3',
            'gLgk8Nt7ograVzCsgQz1JM05QJtpzDbk',
        );
        expect(DECRYPTED).toBeDefined();
        expect(typeof DECRYPTED).toBe('string');
        expect(DECRYPTED).toMatch(/^[a-zA-Z0-9]+$/);
    });
});

describe('Helper generate hash key', () => {
    it('HashKeyGen_Void_HashKey', () => {
        const HASH_KEY = HashKeyGen();
        expect(HASH_KEY).toBeDefined();
        expect(typeof HASH_KEY).toBe('string');
        expect(HASH_KEY.length).toBe(32);
        expect(HASH_KEY).toMatch(/^[a-zA-Z0-9]+$/);
    });
});
