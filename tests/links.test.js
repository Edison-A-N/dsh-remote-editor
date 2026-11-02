import { test } from 'node:test'
import assert from 'node:assert/strict'
import { defaultHost, encodePath, remoteUri, validHost } from '../lib/links.js'
import { createInfoHandler } from '../lib/index.js'

test('builds Cursor and VS Code Remote-SSH links', () => {
  assert.equal(
    remoteUri({ editor: 'cursor', host: 'dev@192.0.2.10', path: '/srv/projects/my-app' }),
    'cursor://vscode-remote/ssh-remote+dev@192.0.2.10/srv/projects/my-app',
  )
  assert.equal(
    remoteUri({ editor: 'vscode', host: 'devbox', path: '/srv/app' }),
    'vscode://vscode-remote/ssh-remote+devbox/srv/app',
  )
})

test('unknown editor falls back to Cursor', () => {
  assert.match(remoteUri({ editor: 'nope', host: 'h', path: '/a' }), /^cursor:\/\//)
})

test('encodes path segments but keeps slashes', () => {
  assert.equal(encodePath('/a b/中文/#x?'), '/a%20b/%E4%B8%AD%E6%96%87/%23x%3F')
})

test('rejects hosts that could break the URL and relative paths', () => {
  for (const bad of ['', 'a/b', 'a b', 'a?x', 'a#x', 'a%20', 'a+b', 'x'.repeat(254)]) {
    assert.equal(validHost(bad), false, bad)
    assert.equal(remoteUri({ editor: 'cursor', host: bad, path: '/a' }), undefined)
  }
  assert.equal(validHost('user@host.example.com:2222'), true)
  assert.equal(remoteUri({ editor: 'cursor', host: 'h', path: 'rel/path' }), undefined)
  assert.equal(remoteUri({ editor: 'cursor', host: 'h', path: undefined }), undefined)
})

test('refuses ssh option-looking hosts', () => {
  for (const bad of ['-oProxyCommand', '-Elog', '-']) assert.equal(validHost(bad), false, bad)
  assert.equal(validHost('my-host'), true)
})

test('refuses dot segments that URL parsing would fold into the host part', () => {
  for (const path of ['/..', '/../etc', '/a/./b', '/a/..']) {
    assert.equal(remoteUri({ editor: 'cursor', host: 'h', path }), undefined, path)
  }
  // Dotfiles and dotted names are ordinary segments.
  assert.equal(remoteUri({ editor: 'cursor', host: 'h', path: '/a/.config/b..c' }), 'cursor://vscode-remote/ssh-remote+h/a/.config/b..c')
  // Every accepted link keeps the ssh-remote authority after URL parsing.
  const parsed = new URL(remoteUri({ editor: 'cursor', host: 'dev@192.0.2.10', path: '/a b/%2E%2E/x' }))
  assert.equal(parsed.hostname, 'vscode-remote')
  assert.match(parsed.pathname, /^\/ssh-remote\+dev@192\.0\.2\.10\//)
})

test('default host is user@page-host', () => {
  assert.equal(defaultHost('dev', '192.0.2.10'), 'dev@192.0.2.10')
  assert.equal(defaultHost(undefined, 'box'), 'box')
  assert.equal(defaultHost('u', 'fe80::1'), 'u@[fe80::1]')
  assert.equal(defaultHost('u', ''), '')
})

function fakeRes() {
  const res = { status: 0, body: '' }
  res.writeHead = (status) => { res.status = status }
  res.end = (data) => { res.body = data ?? '' }
  return res
}

test('info route is fenced and GET-only', () => {
  const handler = createInfoHandler({ authorize: (_req, res) => { res.status = 401; return false }, user: () => 'u' })
  const denied = fakeRes()
  handler({ method: 'GET' }, denied)
  assert.equal(denied.status, 401)

  const open = createInfoHandler({ authorize: () => true, user: () => 'u' })
  const ok = fakeRes()
  open({ method: 'GET' }, ok)
  assert.deepEqual(JSON.parse(ok.body), { user: 'u' })
  const post = fakeRes()
  open({ method: 'POST' }, post)
  assert.equal(post.status, 405)
})

test('zh and en dictionaries carry the same keys and placeholders', async () => {
  const { en, zh } = await import('../client/src/locales.js')
  assert.deepEqual(Object.keys(zh).sort(), Object.keys(en).sort())
  const vars = (s) => (s.match(/\{\w+\}/g) ?? []).sort()
  for (const key of Object.keys(en)) assert.deepEqual(vars(zh[key]), vars(en[key]), key)
})
