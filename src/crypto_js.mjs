import { generateKeyPairSync } from "node:crypto";

export function generateKeyPairRsa() {
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

export function generateKeyPairEc() {
  const { publicKey, privateKey } = generateKeyPairSync("ec", {
    namedCurve: "P-521",
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
