import crypto, { generateKeyPairSync } from "node:crypto";
// const sign = crypto.createSign("RSA-SHA256");

// sign.update("some data to sign");
// console.log(privateKey);
// console.log(publicKey);
// console.log(sign.sign(privateKey, "base64"));

export function generateKeyPair() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });
  return { public_key: publicKey, private_key: privateKey };
}
