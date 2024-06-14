import gleam/javascript/promise.{type Promise}

@external(javascript, "./jwt_js.mjs", "encodeString")
pub fn encode_string(
  payload: String,
  secret: String,
  alg: String,
) -> Promise(String) {
  todo as "javascript target only"
}
