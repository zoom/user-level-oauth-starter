const crypto = require('node:crypto');
const { ZOOM_CRYPTO_ALGO } = require('./constants');

const { MYSQL_CIPHER_KEY } = process.env;

/**
 * NOTE: Ensure your MYSQL_CIPHER_KEY key length matches the required length
 * of your selected crypto algorithm. For our CRYPTO_ALGO example 'aes-256-ctr':
 * a 256 bit / 32 byte key is required
 */

const encrypt = (text = '') => {
  const initializationVector = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ZOOM_CRYPTO_ALGO, MYSQL_CIPHER_KEY, initializationVector);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${initializationVector.toString('hex')}.${encrypted.toString('hex')}`;
};

const decrypt = (encryptedText = '') => {
  const [initializationVector = '', text = ''] = encryptedText.split('.');
  const decipher = crypto.createDecipheriv(ZOOM_CRYPTO_ALGO, MYSQL_CIPHER_KEY, Buffer.from(initializationVector, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(text, 'hex')), decipher.final()]);

  return decrpyted.toString();
};

module.exports = {
  encrypt,
  decrypt,
};
