/**
 * Remote-SSH deep links: URLs that the user's own operating system hands to
 * a locally installed editor, which then connects back to this server over
 * SSH and opens the directory. Pure functions, shared by the browser half
 * and the tests.
 * @module dsh-remote-editor/links
 */

/** Editors whose URL handler accepts `<scheme>://vscode-remote/ssh-remote+<host><path>`. */
export const EDITORS = [
  { id: 'cursor', name: 'Cursor', scheme: 'cursor' },
  { id: 'vscode', name: 'VS Code', scheme: 'vscode' },
  { id: 'vscode-insiders', name: 'VS Code Insiders', scheme: 'vscode-insiders' },
  { id: 'windsurf', name: 'Windsurf', scheme: 'windsurf' },
]

/** Find an editor by id, falling back to the first entry. */
export function editorById(id) {
  return EDITORS.find((editor) => editor.id === id) ?? EDITORS[0]
}

/**
 * Whether a string is usable as the Remote-SSH host: an ~/.ssh/config alias,
 * `host`, or `user@host`, with an optional `:port`. Anything that could break
 * out of the URL authority (`/ ? # %` whitespace, `+`) is refused, and so is
 * a leading `-`, which ssh would read as an option.
 */
export function validHost(host) {
  return typeof host === 'string' && /^(?!-)[A-Za-z0-9._@:\[\]-]{1,253}$/.test(host)
}

/** Percent-encode each path segment, keeping the `/` separators. */
export function encodePath(path) {
  return path.split('/').map((segment) => encodeURIComponent(segment)).join('/')
}

/** Whether an absolute path has `.` or `..` segments, which URL parsing would collapse into the host part. */
function hasDotSegment(path) {
  return path.split('/').some((segment) => segment === '.' || segment === '..')
}

/**
 * Build the deep link for one editor, host, and absolute POSIX path.
 * @param {{ editor: string, host: string, path: string }} input
 * @returns {string | undefined} the URL, or undefined when an input is unusable.
 */
export function remoteUri({ editor, host, path }) {
  if (!validHost(host)) return undefined
  if (typeof path !== 'string' || !path.startsWith('/') || hasDotSegment(path)) return undefined
  const { scheme } = editorById(editor)
  return `${scheme}://vscode-remote/ssh-remote+${host}${encodePath(path)}`
}

/**
 * Default host when the user has not set one: the server account at the
 * address the browser already uses to reach this page.
 * @param {string | undefined} user - server account name.
 * @param {string} pageHost - `location.hostname`.
 */
export function defaultHost(user, pageHost) {
  if (!pageHost) return ''
  const host = pageHost.includes(':') && !pageHost.startsWith('[') ? `[${pageHost}]` : pageHost
  return user ? `${user}@${host}` : host
}
