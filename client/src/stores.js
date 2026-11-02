/**
 * Browser-side preferences: chosen editor and SSH host, kept in localStorage
 * because they describe the user's own machine, not the server.
 */
import { EDITORS, defaultHost } from '../../lib/links.js'

const KEY = 'dsh-remote-editor:prefs'
const INFO = '/plugins/remote-editor/api/info'

function observable(initial) {
  let value = initial
  const listeners = new Set()
  return {
    get: () => value,
    set(next) {
      value = next
      for (const fn of [...listeners]) fn()
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}

function readPrefs() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    return {
      editor: EDITORS.some((e) => e.id === raw.editor) ? raw.editor : EDITORS[0].id,
      host: typeof raw.host === 'string' ? raw.host : '',
    }
  } catch {
    return { editor: EDITORS[0].id, host: '' }
  }
}

export const prefs = observable(readPrefs())

export function setPrefs(patch) {
  const next = { ...prefs.get(), ...patch }
  prefs.set(next)
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
}

/** Default SSH target derived from the server account and the page address. */
export const fallbackHost = observable(defaultHost(undefined, location.hostname))

let infoLoaded = false
export function loadInfo() {
  if (infoLoaded) return
  infoLoaded = true
  fetch(INFO, { credentials: 'same-origin' })
    .then((res) => (res.ok ? res.json() : undefined))
    .then((info) => {
      if (info && typeof info.user === 'string') fallbackHost.set(defaultHost(info.user, location.hostname))
    })
    .catch(() => {})
}
