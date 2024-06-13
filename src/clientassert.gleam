import crypto.{KeyPair}
import gleam/io
import gwt.{type Jwt, type Unverified, type Verified}

import argv
import snag

// glint imports
import glint

pub fn main() {
  glint.new()
  |> glint.with_name("clientassert")
  |> glint.with_pretty_help(glint.default_pretty_help())
  |> glint.add(
    at: [],
    do: glint.command(client_assertion)
      |> glint.description(
        "Prints public key and client assertion for subject <SUBJECT>",
      ),
  )
  |> glint.run(argv.load().arguments)
}

fn client_assertion(input: glint.CommandInput) -> Nil {
  let subject = case input.args {
    [subject, ..] -> subject
    _ -> todo as "handle missing arg"
  }

  let KeyPair(public_key, private_key) = crypto.generate_key_pair_ec()

  let client_assertion_jwt =
    gwt.new()
    |> gwt.set_subject(subject)
    |> gwt.to_signed_string(gwt.HS512, private_key)

  io.println("PUBLIC KEY:")
  io.println(public_key)

  io.println("CLIENT ASSERTION JWT:")
  io.println(client_assertion_jwt)
}
