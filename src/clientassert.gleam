import crypto.{KeyPair}
import gleam/io

pub fn main() {
  let KeyPair(ec1, ec2) =
    crypto.generate_key_pair_ec()
    |> io.debug
}
