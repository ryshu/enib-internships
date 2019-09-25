import crypto from 'crypto';

/**
 * @summary Method to encrypt text
 * @param {string} text Text that you want to encrypt
 * @returns {string} encrypted text
 */
export function HelperEncrypt(text: string, key?: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(key ? key : process.env.HASH_KEY),
        iv,
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * @summary Method to decrypt text
 * @param {string} text Text that you want to decrpt
 * @returns {string} decrypted text
 */
export function HelperDecrypt(text: string, key?: string): string {
    const textSplited = text.split(':');
    const iv = Buffer.from(textSplited[0], 'hex');
    const encryptedText = Buffer.from(textSplited[1], 'hex');
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(key ? key : process.env.HASH_KEY),
        iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

/**
 * @summary Method use to generate a new random hash key to encode exported file
 * @returns {string} Generated hash key
 */
export function HashKeyGen(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let key = '';

    for (let i = 0; i < 32; i++) {
        key += chars[Math.floor(Math.random() * 62)];
    }

    return key;
}
