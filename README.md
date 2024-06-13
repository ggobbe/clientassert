# clientassert

<!-- [![Package Version](https://img.shields.io/hexpm/v/clientassert)](https://hex.pm/packages/clientassert) -->
<!-- [![Hex Docs](https://img.shields.io/badge/hex-docs-ffaff3)](https://hexdocs.pm/clientassert/) -->

## Usage

```sh
gleam run "subject"
```

### Output

```
PUBLIC KEY:
-----BEGIN PUBLIC KEY-----
MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQBZufi0lIwM8dlhjYM6Yw0uLD9YnWg
Nau71AQWiY1phnZ9Nchd/SQi5Fd1xqwFnQpgKTKPCd20cKXnhRftXMZ9lQ0AdPgd
uNhMyOV+LuErnR2CDzTJZ3FqtianEv+W3HxcrcySsaHynKKkqJR6ArrRIGRkS0Y4
q8cEoZVgjXh8SusgGv0=
-----END PUBLIC KEY-----

CLIENT ASSERTION JWT:
eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdWJqZWN0In0.CIMThLBOZYHXanM1LjUuQe5VKBXgAkCz1z9y2OC7wpA4kJscDafbtvbSq29ujgfwyY6Zw9uYDfTjv_mXvv_9hQ  
```

### JWT payload

```
{
  "sub": "subject"
}
```
