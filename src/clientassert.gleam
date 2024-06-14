import argv
import crypto
import gleam/io
import gleam/javascript/promise
import gleam/json.{object, string}
import gleam/option.{type Option, None, Some}
import gleam/string
import jwt

pub fn main() {
  let subject = case parse_args(argv.load().arguments) {
    Some(s) -> s
    None -> panic as "args: Subject is required"
  }

  let keypair = crypto.generate_key_pair_rsa()

  use jwt <- promise.await(
    object([#("sub", string(subject))])
    |> json.to_string
    |> jwt.encode_string(keypair.private_key, "RS256"),
  )

  // io.println("PRIVATE KEY:")
  // io.println(keypair.private_key)

  io.println("PUBLIC KEY:")
  io.println(keypair.public_key)

  io.println("PUBLIC KEY (single line):")
  io.println(keypair.public_key |> string.trim() |> string.replace("\n", "\\n"))

  io.println("\nJWT:")
  io.println(jwt)

  promise.resolve("")
}

fn parse_args(args: List(String)) -> Option(String) {
  case args {
    [subject] -> Some(subject)
    _ -> None
  }
}
