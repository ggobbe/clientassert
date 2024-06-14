import { subtle } from "node:crypto";

const PRIVATE_KEY_HEADER = "-----BEGIN PRIVATE KEY-----";
const PRIVATE_KEY_FOOTER = "-----END PRIVATE KEY-----";
const PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----";
const PUBLIC_KEY_FOOTER = "-----END PUBLIC KEY-----";
export const ALGORITHM_PARAMS = {
  HS256: { name: "HMAC", hash: "SHA-256" },
  HS384: { name: "HMAC", hash: "SHA-384" },
  HS512: { name: "HMAC", hash: "SHA-512" },
  RS256: { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
  RS384: { name: "RSASSA-PKCS1-v1_5", hash: "SHA-384" },
  RS512: { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" },
};

export const encode = async (payload, secret, alg = "HS256") => {
  encodeString(JSON.stringify(payload), secret, alg);
};

export const encodeString = async (payload, secret, alg = "HS256") => {
  const algorithm = ALGORITHM_PARAMS[alg];
  const isSymmetric = algorithm.name === "HMAC";
  const keyData = isSymmetric
    ? new TextEncoder().encode(secret)
    : base64ToUint8Array(
        secret
          .trim()
          .slice(PRIVATE_KEY_HEADER.length, -PRIVATE_KEY_FOOTER.length),
        false,
      );
  const key = await subtle.importKey(
    isSymmetric ? "raw" : "pkcs8",
    keyData,
    algorithm,
    false,
    ["sign"],
  );
  const encodedHeader = b64UrlEncode(`{"typ":"JWT","alg":"${alg}"}`);
  const encodedHeaderAndPayload = encodedHeader + "." + b64UrlEncode(payload);
  const signature = await subtle.sign(
    algorithm,
    key,
    new TextEncoder().encode(encodedHeaderAndPayload),
  );
  return (
    encodedHeaderAndPayload +
    "." +
    uint8ArrayToBase64(new Uint8Array(signature))
  );
};
export const decode = async (token, secret, alg = "HS256") => {
  if (token.split(".").length !== 3) throw Error("Invalid token format.");
  const header = decodeHeader(token);
  const payload = decodePayload(token);
  const now = Date.now() / 1000;
  if (header.alg !== alg) {
    throw Error(
      `Token header "alg" value [${header.alg}] does not match the expected algorithm [${alg}].`,
    );
  }
  if (payload.nbf && payload.nbf > now) {
    throw Error("Token is not yet active.");
  }
  if (payload.exp && payload.exp < now) {
    throw Error("Token has expired.");
  }
  const algorithm = ALGORITHM_PARAMS[alg];
  const isSymmetric = algorithm.name === "HMAC";
  const keyData = isSymmetric
    ? new TextEncoder().encode(secret)
    : base64ToUint8Array(
        secret
          .trim()
          .slice(PUBLIC_KEY_HEADER.length, -PUBLIC_KEY_FOOTER.length),
        false,
      );
  const key = await subtle.importKey(
    isSymmetric ? "raw" : "spki",
    keyData,
    algorithm,
    false,
    ["verify"],
  );
  const signature = base64ToUint8Array(token.slice(token.lastIndexOf(".") + 1));
  const data = new TextEncoder().encode(token.slice(0, token.lastIndexOf(".")));
  const isVerified = await subtle.verify(algorithm, key, signature, data);
  if (!isVerified) throw Error("Invalid signature.");
  return payload;
};
function decodeHeader(token) {
  return JSON.parse(
    new TextDecoder().decode(
      base64ToUint8Array(token.slice(0, token.indexOf("."))),
    ),
  );
}
function decodePayload(token) {
  const start = token.indexOf(".") + 1;
  const end = token.lastIndexOf(".");
  return JSON.parse(
    new TextDecoder().decode(base64ToUint8Array(token.slice(start, end))),
  );
}
function b64UrlEncode(utf8) {
  return uint8ArrayToBase64(new TextEncoder().encode(utf8));
}

/**
 * Base64 encoding and decoding.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
 */
export function uint8ArrayToBase64(bytes, urlSafe = true) {
  const str = Array.from(bytes).reduce((prev, _, i, arr) => {
    if (i % 3 !== 2 && i < arr.length - 1) return prev;
    const segment = (() => {
      const nUint24 = new Array((i % 3) + 1)
        .fill(0)
        .reduce((prev, _, j, { length }) => {
          const byteIndex = j - i + length - 1 + Math.floor(i / 3) * 6;
          return prev | (arr[byteIndex] << ((16 >>> j % 3) & 24));
        }, 0);
      return [18, 12, 6, 0].reduce((prev, bits) => {
        const codePoint = ((n) => {
          if (n >= 26 && n < 52) return n + 71;
          if (n >= 52 && n < 62) return n - 4;
          if (n === 62) return urlSafe ? 45 : 43;
          if (n === 63) return urlSafe ? 95 : 47;
          return n + 65;
        })((nUint24 >>> bits) & 63);
        return prev + String.fromCodePoint(codePoint);
      }, "");
    })();
    return prev + segment;
  }, "");
  return str
    .slice(0, str.length - 2 + ((bytes.length - 1) % 3))
    .padEnd(str.length, urlSafe ? "" : "=");
}
export function base64ToUint8Array(str, urlSafe = true) {
  return Uint8Array.from(
    str
      .replace(urlSafe ? /[^A-Za-z0-9-_]/g : /[^A-Za-z0-9+/]/g, "")
      .split("")
      .flatMap((_, i, arr) => {
        if ((i & 3) !== 3 && i < arr.length - 1) return [];
        const nUint24 = new Array((i & 3) + 1)
          .fill(0)
          .reduce((prev, _, j, { length }) => {
            const nInIndex = j - i + length - 1 + Math.floor(i / 4) * 8;
            const uInt6 = ((n) => {
              if (n > 96 && n < 123) return n - 71;
              if (n > 47 && n < 58) return n + 4;
              if (n === (urlSafe ? 45 : 43)) return 62;
              if (n === (urlSafe ? 95 : 47)) return 63;
              return n - 65;
            })(arr[nInIndex].charCodeAt(0));
            return prev | (uInt6 << (6 * (3 - (nInIndex & 3))));
          }, 0);
        return new Array(i & 3)
          .fill(0)
          .map((_, j) => (nUint24 >>> ((16 >>> j) & 24)) & 255);
      }),
  );
}
