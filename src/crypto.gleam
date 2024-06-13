pub type KeyPair {
  KeyPair(public_key: String, private_key: String)
}

@external(javascript, "./crypto_js.mjs", "generateKeyPair")
pub fn generate_key_pair() -> KeyPair {
  todo
}
