pub type KeyPair {
  KeyPair(public_key: String, private_key: String)
}

@external(javascript, "./crypto_js.mjs", "generateKeyPairRsa")
pub fn generate_key_pair_rsa() -> KeyPair {
  todo as "javascript target only"
}

@external(javascript, "./crypto_js.mjs", "generateKeyPairEc")
pub fn generate_key_pair_ec() -> KeyPair {
  todo as "javascript target only"
}
