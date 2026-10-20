# Changelog

All notable changes to the `convertapi-js` npm package. Versions follow [Semantic Versioning](https://semver.org/);
from 1.1.10 on each one is a GitHub Release `v{version}` (see [RELEASING.md](RELEASING.md)). Stable 1.1.x
versions are published under the npm dist-tag `module`; `latest` stays on the non-module 1.0.8.

## 1.1.10 - 2026-10-20

- No change to the library code.
- `package.json` points at the renamed repository, https://github.com/ConvertAPI/convertapi-library-js,
  and names the type declarations (`types`).
- The README's remote-file example uses a file that exists
  (https://cdn.convertapi.com/cara/testfiles/presentation.pptx).
- Published from GitHub Actions with npm provenance. Tested on Node.js 20, 22 and 24, including live
  conversions against the staging API.

## 1.1.9 - 2024-08-20

- Authenticate with an API token in the `Authorization: Bearer` header. `ConvertApi.auth()` takes the token
  as a string.

## 1.1.0 - 2022-06-21

- ES module build (`"type": "module"`, `dist/`), published under the dist-tag `module`.

## 1.0.8 - 2022-06-21

- Last non-module build (git tag `last_nonmodule`), still the npm dist-tag `latest`. Authenticates with
  the retired secret or API key and token in the query string.
