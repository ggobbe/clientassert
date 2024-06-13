import crypto.{KeyPair}
import gleam/io
import gwt.{type Jwt, type Unverified, type Verified}

pub fn main() {
  let KeyPair(public_key, private_key) = crypto.generate_key_pair_ec()

  let client_assertion_jwt =
    gwt.new()
    |> gwt.set_subject("abcdef")
    |> gwt.to_signed_string(gwt.HS512, private_key)

  io.println("PUBLIC KEY:")
  io.println(public_key)

  io.println("CLIENT ASSERTION JWT:")
  io.println(client_assertion_jwt)
}
