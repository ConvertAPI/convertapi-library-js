# Releasing

`main` is the only long-lived branch. Changes reach it through pull requests, merge commits only, and
every pull request and push to `main` must pass the `build` check (`.github/workflows/build.yml`: build
the TypeScript sources and run the tests on Node.js 20, 22 and 24, audit the runtime dependencies, pack).
Merging publishes nothing.

The unit tests (`test/convertapi.test.js`) stub `fetch`. The live tests (`test/live.test.js`) convert real
files against the staging API (`stag-v2.convertapi.com`) with the `CONVERTAPI_STAGING_TOKEN` repository
secret (also set as a Dependabot secret); without it they are skipped. Locally:

```bash
npm ci
npm test
CONVERT_API_SECRET=<staging token> CONVERT_API_HOST=stag-v2.convertapi.com npm test
```

A release is a **GitHub Release** whose tag is the version, published by `tomasr78`:

```bash
gh release create v1.1.10 --repo ConvertAPI/convertapi-library-js --target main --title v1.1.10 --generate-notes
```

That runs `.github/workflows/publish.yml` in the `npm` environment (deployable from `v*` tags only), which:

1. refuses a Release published or re-run by anyone else;
2. checks the tag is SemVer (`v1.1.10`, `v1.2.0-beta.1`), that the GitHub pre-release tick matches the
   version, that a stable version is a commit on `main`, and that npm has never had that version;
3. audits the runtime dependencies, sets `package.json` to the tag's version
   (`npm version --no-git-tag-version`), builds `dist/` and runs the unit and live tests (the live tests
   are required here);
4. publishes the packed tarball to npm with `--provenance` through npm **Trusted Publishing** (OIDC, no
   stored token) and waits until npm serves it.

The trusted publisher on npmjs.com (https://www.npmjs.com/package/convertapi-js/access) is: publisher
GitHub Actions, organization or user `ConvertAPI`, repository `convertapi-library-js`, workflow filename
`publish.yml`, environment name `npm`.

## Dist-tags

| Dist-tag | Gets | Installed with |
|---|---|---|
| `latest` | `1.0.8`, the last **non-module** build (git tag `last_nonmodule`), kept on purpose | `npm i convertapi-js` |
| `module` | stable releases from `main` (the ES module line, `1.1.x`) | `npm i convertapi-js@~1.1` (as the README says) |
| `next` | pre-releases | `npm i convertapi-js@next` |
| `maintenance` | a stable version lower than the current `module` one | `npm i convertapi-js@maintenance` |

A release never moves `latest`. Moving it to the module line changes what `npm i convertapi-js` and
unversioned CDN URLs (for example https://cdn.jsdelivr.net/npm/convertapi-js) serve, which breaks pages
that load the non-module build with a script tag, so it is a separate decision:
`npm dist-tag add convertapi-js@1.1.10 latest`.

**Pre-releases** work the same way and may come from any branch:

```bash
gh release create v1.2.0-beta.1 --repo ConvertAPI/convertapi-library-js --target my-branch --prerelease --title v1.2.0-beta.1 --notes "Preview of ..."
```

npm versions are permanent. A bad version can only be deprecated
(`npm deprecate convertapi-js@1.1.10 "..."`) and fixed by releasing the next version. Never delete and
re-create a release tag.

The version in `package.json` is a `0.0.0-local` placeholder, and `npm publish` from a working copy is
refused. Pull request builds pack `0.0.0-ci.{run}.g{sha}` as a downloadable artifact so a change can be
tried before it is released. Update `CHANGELOG.md` in the pull request that changes behaviour.
