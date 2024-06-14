import crypto, { generateKeyPairSync } from "node:crypto";

export function generateKeyPairRsa() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048, // 2048, 4096
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

export function generateKeyPairEc() {
  const { publicKey, privateKey } = generateKeyPairSync("ec", {
    namedCurve: "P-256", // P-256, P-384, P-521
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
