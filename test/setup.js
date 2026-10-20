// The library is written for browsers. Node.js 20+ has fetch, File and URL, but no FileList, which
// Params.add() checks with instanceof, so the tests give it an empty stand-in before importing dist/.
if (typeof globalThis.FileList === 'undefined') {
    globalThis.FileList = class FileList {}
}

// Replaces globalThis.fetch for one test with a stub that records each request and answers with the
// next of the given responses ({ status, body }).
export function stubFetch(t, ...responses) {
    const calls = []
    const original = globalThis.fetch
    globalThis.fetch = async (url, init = {}) => {
        calls.push({ url: String(url), init })
        const next = responses.shift()
        if (!next) throw new Error(`Unexpected request to ${url}`)
        return new Response(JSON.stringify(next.body), {
            status: next.status ?? 200,
            headers: { 'content-type': 'application/json' }
        })
    }
    t.after(() => { globalThis.fetch = original })
    return calls
}
