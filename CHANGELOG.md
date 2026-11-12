# Changelog

All notable changes to the `convertapi-js` npm package. Versions follow [Semantic Versioning](https://semver.org/);
from 1.1.10 on each one is a GitHub Release `v{version}` (see [RELEASING.md](RELEASING.md)). Stable
versions are published under the npm dist-tag `latest`; up to 1.1.11 they went to the dist-tag `module`,
and `latest` stayed on the non-module 1.0.8.

## Unreleased

- Stable releases take the npm dist-tag `latest` instead of `module`, so `npm i convertapi-js` and
  unversioned CDN URLs get the ES module build. `latest` was moved from 1.0.8 to 1.1.11 on 2026-11-12
  (`npm dist-tag add`). `module` stays on 1.1.11. A page that loads the non-module
  1.0.8 with an unversioned script tag must pin it: https://unpkg.com/convertapi-js@1.0.8/lib/convertapi.js

## 1.1.11 - 2026-10-20

- No change to the library code.
- The GitHub Release v1.1.10 did not reach npm (its publish step failed, fixed in
  https://github.com/ConvertAPI/convertapi-library-js/pull/28), so npm has no 1.1.10; 1.1.11 is the same code.
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

- Last non-module build (git tag `last_nonmodule`). It kept the npm dist-tag `latest` until the ES module
  line took it over. Authenticates with the retired secret or API key and token in the query string.
