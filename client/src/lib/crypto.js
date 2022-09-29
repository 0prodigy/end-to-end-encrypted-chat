import crypto from "crypto";

export const generatePair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "end-to-end-encryption",
    },
  });
  return { publicKey, privateKey };
};

export const encrypt = (data, publicKey) => {
  const buffer = Buffer.from(data);
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

export const decrypt = (data, privateKey) => {
  const buffer = Buffer.from(data, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: "end-to-end-encryption",
    },
    buffer
  );
  return decrypted.toString("utf8");
};
