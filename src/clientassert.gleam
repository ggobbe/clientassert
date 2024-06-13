import crypto.{KeyPair}
import gleam/io

pub fn main() {
  io.println("Hello from clientassert!")

  let KeyPair(public_key, private_key) = crypto.generate_key_pair()

  io.println("public key")
  public_key |> io.debug

  io.println("private key")
  private_key |> io.debug
}
