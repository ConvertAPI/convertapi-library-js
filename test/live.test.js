// Converts real files through the API. Runs only when CONVERT_API_SECRET holds an API token; CI points
// CONVERT_API_HOST at the staging API (stag-v2.convertapi.com) and uses a staging token.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import './setup.js'
import ConvertApi from '../dist/convertapi.js'

const token = process.env.CONVERT_API_SECRET
const host = process.env.CONVERT_API_HOST || 'v2.convertapi.com'
const skip = token ? false : 'CONVERT_API_SECRET is not set'

test('uploads a file, converts it and chains the result', { skip, timeout: 120_000 }, async () => {
    const api = ConvertApi.auth(token, host)

    const params = api.createParams()
    params.add('File', new File(['Hello from convertapi-js'], 'hello.txt', { type: 'text/plain' }))
    const pdf = await api.convert('txt', 'pdf', params)
    assert.equal(pdf.files.length, 1)
    assert.equal(pdf.files[0].FileExt, 'pdf')
    assert.ok(pdf.files[0].FileSize > 0)

    const next = api.createParams()
    next.add('File', pdf.toParamFile())
    const jpg = await api.convert('pdf', 'jpg', next)
    assert.equal(jpg.files[0].FileExt, 'jpg')

    const download = await fetch(jpg.files[0].Url)
    assert.equal(download.status, 200)
})

test('converts a remote file by URL', { skip, timeout: 120_000 }, async () => {
    const api = ConvertApi.auth(token, host)
    const params = api.createParams()
    params.add('File', new URL('https://cdn.convertapi.com/cara/testfiles/presentation.pptx'))
    const res = await api.convert('pptx', 'pdf', params)
    assert.equal(res.files[0].FileExt, 'pdf')
})

test('rejects an invalid token', { skip, timeout: 60_000 }, async () => {
    const api = ConvertApi.auth('not-a-valid-token', host)
    const params = api.createParams()
    params.add('Url', 'https://www.convertapi.com')
    await assert.rejects(api.convert('web', 'pdf', params), err => typeof err.Code === 'number' && typeof err.Message === 'string')
})
