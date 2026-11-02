/**
 * dsh-remote-editor — open the session's workspace in an editor installed on
 * the machine running the browser, through Remote-SSH deep links
 * (`cursor://vscode-remote/ssh-remote+<host><path>` and the VS Code family).
 *
 * The official "Open In..." button launches applications on the DSH host,
 * which is useless when the browser is on another machine. A web page cannot
 * start local applications itself, but it can follow a link whose scheme the
 * user's operating system routes to the editor; the editor then connects
 * back over SSH.
 *
 * Node half: one login-fenced route telling the browser the server account
 * name, used for the default `user@<page host>` SSH target. Nothing here
 * launches anything.
 * @module dsh-remote-editor
 */
import { userInfo } from 'node:os'

export const name = 'remote-editor'
export const inject = ['webServer', 'connection']
export const Config = undefined

export const INFO_PATH = '/plugins/remote-editor/api/info'

export { EDITORS, remoteUri, validHost, defaultHost, encodePath } from './links.js'

/** Server account name; undefined when the OS cannot answer. */
export function accountName() {
  try {
    return userInfo().username
  } catch {
    return undefined
  }
}

/**
 * Request handler (exported for tests).
 * @param {{ authorize: (req: any, res: any) => boolean, user: () => string | undefined }} deps
 */
export function createInfoHandler({ authorize, user }) {
  return (req, res) => {
    if (!authorize(req, res)) return
    if (req.method !== 'GET') {
      res.writeHead(405, { allow: 'GET', 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: 'method not allowed' }))
      return
    }
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
    res.end(JSON.stringify({ user: user() ?? null }))
  }
}

/** @param {import('@deepseek-ai/cordis').Context} ctx */
export function apply(ctx) {
  return ctx.webServer.register({
    kind: 'exact',
    path: INFO_PATH,
    handler: createInfoHandler({
      authorize: (req, res) => ctx.connection.authorizeIndex(req, res),
      user: accountName,
    }),
  })
}
