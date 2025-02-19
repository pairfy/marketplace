const crypto = require("crypto");
const openpgp = require("openpgp");
const argon2 = require("argon2");
require("dotenv").config();

// Function to derive a key from passphrase using Argon2
async function deriveKey(passphrase, salt) {
  // Argon2 key derivation with latest api
  const key = await argon2.hash(passphrase, {
    type: argon2.argon2id, // argon2id is recommended for most use cases
    salt: salt, // Provide the salt as a buffer
    timeCost: 3, // Number of iterations (time cost)
    memoryCost: 2 ** 16, // Memory cost (64MB)
    parallelism: 1, // Parallelism factor
    hashLength: 32, // 256-bit key for AES-256
  });

  return Buffer.from(key.slice(0, 32)); // Truncate to 32 bytes (256 bits)
}

// AES-256 Encryption (Base64 output only)
async function encryptWithAES(text, passphrase) {
  const salt = crypto.randomBytes(16); // Generate random salt
  const iv = crypto.randomBytes(16); // Generate random IV

  // Derive the encryption key using Argon2
  const key = await deriveKey(passphrase, salt);

  // Encrypt the plaintext
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64"); // Ensure the final part is also in base64

  // Concatenate salt and IV with encrypted data and return it in Base64 format

  return `${salt.toString("base64")}:${iv.toString("base64")}:${encrypted}`;
}

async function decryptWithAES(encryptedData, passphrase) {
  const [saltBase64, ivBase64, encryptedText] = encryptedData.split(":");

  // Convert salt and IV from Base64 to Buffer
  const salt = Buffer.from(saltBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");

  // Derive the key using the same passphrase and salt
  const key = await deriveKey(passphrase, salt);

  // Decrypt the ciphertext
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

//////////////////////////////////

/**
 * Generates an RSA key pair (private and public keys).
 * @param {string} name - Name for the key metadata.
 * @param {string} email - Email for the key metadata.
 * @param {string} passphrase - Passphrase to secure the private key.
 * @returns {Promise<{ privateKey: string, publicKey: string }>}
 * - The private and public keys in armored format.
 */
async function generateRSAKeyPair(RSAmetadata, passphrase) {
  try {
    // Generate private key
    const { privateKey } = await openpgp.generateKey({
      type: "rsa",
      rsaBits: 4096,
      userIDs: [RSAmetadata],
      passphrase,
    });

    const unlockedPrivateKey = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
      passphrase,
    });

    const publicKey = unlockedPrivateKey.toPublic().armor();

    return { privateKey, publicKey };
  } catch (error) {
    console.error("Key pair generation failed:", error);
    throw error;
  }
}

/**
 * Encrypts a text message using RSA and OpenPGP.
 * @param {string} message - The plaintext message to encrypt.
 * @param {string} publicKey - The recipient's public key (armored format).
 * @returns {Promise<string>} - The encrypted message in armored format.
 */
async function encryptWithRSA(message, publicKey) {
  try {
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: message }),
      encryptionKeys: await openpgp.readKey({ armoredKey: publicKey }),
    });
    return encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
}

/**
 * Decrypts an encrypted message using the RSA private key.
 * @param {string} encryptedMessage - The encrypted message (armored format).
 * @param {string} privateKey - The recipient's private key (armored format).
 * @param {string} passphrase - Passphrase to unlock the private key.
 * @returns {Promise<string>} - The decrypted plaintext message.
 */
async function decryptWithRSA(encryptedMessage, privateKey, passphrase) {
  try {
    const decryptedPrivateKey = await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
      passphrase,
    });

    const decrypted = await openpgp.decrypt({
      message: await openpgp.readMessage({ armoredMessage: encryptedMessage }),
      decryptionKeys: decryptedPrivateKey,
    });

    return decrypted.data;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
}

async function encryptMetadata(publicKey, metadata) {
  const AESencrypted = await encryptWithAES(
    metadata,
    process.env.AES_PASSPHRASE
  );

  const RSAencrypted = await encryptWithRSA(AESencrypted, publicKey);

  return RSAencrypted;
}

async function decryptMetadata(RSAencrypted, privateKey) {
  const RSAdecrypted = await decryptWithRSA(
    RSAencrypted,
    privateKey,
    process.env.RSA_PASSPHRASE
  );

  const AESdecrypted = await decryptWithAES(
    RSAdecrypted,
    process.env.AES_PASSPHRASE
  );

  return AESdecrypted
}

async function generateRSAkeys(RSAmetadata) {
  try {
    const { privateKey, publicKey } = await generateRSAKeyPair(
      RSAmetadata,
      process.env.RSA_PASSPHRASE
    );

    console.log("BASE64_PRIVATE_KEY\n", Buffer.from(privateKey).toString('base64'))
    
    console.log("BASE64_PUBLIC_KEY\n", Buffer.from(publicKey).toString('base64'))

  } catch (error) {
    console.error("Error in RSA workflow:", error);
  }
}

const RSAmetadata = {
  name: "User",
  email: "user@example.com",
  version: "1.0",
};

generateRSAkeys(RSAmetadata);



