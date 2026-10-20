import { test } from 'node:test'
import assert from 'node:assert/strict'
import { stubFetch } from './setup.js'
import ConvertApi from '../dist/convertapi.js'
import { FileValue } from '../dist/file-param.js'

const result = {
    ConversionCost: 1,
    Files: [{ FileName: 'test.pdf', FileExt: 'pdf', FileSize: 100, FileId: 'f1', Url: 'https://v2.convertapi.com/d/f1/test.pdf' }]
}

test('auth() keeps the token and defaults to v2.convertapi.com', () => {
    const api = ConvertApi.auth('token-1')
    assert.equal(api.authCredentials, 'token-1')
    assert.equal(api.host, 'v2.convertapi.com')
    assert.equal(ConvertApi.auth('token-1', 'example.test').host, 'example.test')
})

test('convert() posts the parameters with a Bearer token and returns the result', async t => {
    const calls = stubFetch(t, { body: result })
    const api = ConvertApi.auth('token-1', 'example.test')
    const params = api.createParams()
    params.add('File', new FileValue('test.docx', 'id-1'))
    params.add('PageRange', '1-2')

    const res = await api.convert('docx', 'pdf', params)

    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://example.test/convert/docx/to/pdf?storefile=true')
    assert.equal(calls[0].init.method, 'POST')
    assert.equal(calls[0].init.headers.authorization, 'Bearer token-1')
    assert.deepEqual(JSON.parse(calls[0].init.body), {
        Parameters: [
            { Name: 'File', FileValue: { Id: 'id-1' } },
            { Name: 'PageRange', Value: '1-2' }
        ]
    })
    assert.equal(res.duration, 1)
    assert.equal(res.files[0].Url, result.Files[0].Url)
})

test('convert() rejects with the API error', async t => {
    stubFetch(t, { status: 401, body: { Code: 4013, Message: 'Invalid token' } })
    const api = ConvertApi.auth('bad', 'example.test')
    await assert.rejects(api.convert('docx', 'pdf', api.createParams()), { Code: 4013, Message: 'Invalid token' })
})

test('a File parameter is uploaded first and sent as its file id', async t => {
    const calls = stubFetch(t, { body: { FileId: 'up-1', FileName: 'a b.txt', FileExt: 'txt' } }, { body: result })
    const api = ConvertApi.auth('token-1', 'example.test')
    const params = api.createParams()
    params.add('File', new File(['hello'], 'a b.txt'))

    await api.convert('txt', 'pdf', params)

    assert.equal(calls[0].url, 'https://example.test/upload?filename=a%20b.txt')
    assert.equal(calls[0].init.method, 'POST')
    assert.deepEqual(JSON.parse(calls[1].init.body).Parameters, [{ Name: 'File', FileValue: { Id: 'up-1' } }])
})

test('a URL parameter is uploaded by URL', async t => {
    const calls = stubFetch(t, { body: { FileId: 'up-2' } }, { body: result })
    const api = ConvertApi.auth('token-1', 'example.test')
    const params = api.createParams()
    params.add('File', new URL('https://cdn.convertapi.com/test-files/presentation.pptx'))

    await api.convert('pptx', 'pdf', params)

    assert.equal(calls[0].url, 'https://example.test/upload?url=https%3A%2F%2Fcdn.convertapi.com%2Ftest-files%2Fpresentation.pptx')
    assert.deepEqual(JSON.parse(calls[1].init.body).Parameters, [{ Name: 'File', FileValue: { Id: 'up-2' } }])
})

test('a failed upload rejects the conversion', async t => {
    stubFetch(t, { status: 500, body: {} })
    const api = ConvertApi.auth('token-1', 'example.test')
    const params = api.createParams()
    params.add('File', new File(['hello'], 'a.txt'))
    await assert.rejects(api.convert('txt', 'pdf', params), { Code: 5007 })
})

test('file lists, file ids and URLs become FileValues', async () => {
    const api = ConvertApi.auth('token-1', 'example.test')
    const params = api.createParams()
    params.add('Files', ['id-1', new URL('https://example.test/a.pdf')])
    assert.deepEqual(await params.dto, {
        Parameters: [{ Name: 'Files', FileValues: [{ Id: 'id-1' }, { Url: 'https://example.test/a.pdf' }] }]
    })
})

test('get() and delete() find parameters by name', () => {
    const params = ConvertApi.auth('token-1').createParams([{ name: 'PageRange', value: '1', isFile: false }])
    assert.equal(params.get('PageRange').value, '1')
    assert.equal(params.delete('PageRange').name, 'PageRange')
    assert.equal(params.get('PageRange'), undefined)
})

test('a result chains into the next conversion', async t => {
    const calls = stubFetch(t, { body: result }, { body: result })
    const api = ConvertApi.auth('token-1', 'example.test')
    const first = await api.convert('docx', 'pdf', api.createParams())

    const params = api.createParams()
    params.add('File', first.toParamFile())
    params.add('Files', first.toParamFiles())
    await api.convert('pdf', 'jpg', params)

    assert.deepEqual(JSON.parse(calls[1].init.body).Parameters, [
        { Name: 'File', FileValue: { Id: 'f1' } },
        { Name: 'Files', FileValues: [{ Id: 'f1' }] }
    ])
})
