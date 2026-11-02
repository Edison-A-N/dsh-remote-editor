/**
 * Session-header button: a native link to `<editor>://vscode-remote/...`
 * for the session's workspace, plus a small panel to pick the editor and the
 * SSH host as the user's own machine knows it.
 *
 * A real `<a href>` is used so the browser treats the click as a user
 * gesture and hands the custom scheme to the operating system; the page
 * itself does not navigate.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { EDITORS, editorById, remoteUri, validHost } from '../../lib/links.js'
import { fallbackHost, loadInfo, prefs, setPrefs } from './stores.js'
import { ICON_PATHS } from './icons.js'
import { en } from './locales.js'

/** English fallback when the host passes no translator. */
function fallbackT(key, vars) {
  return (en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => String(vars?.[k] ?? ''))
}

function useObservable(source) {
  return useSyncExternalStore(source.subscribe, source.get, source.get)
}

/** The selected editor's brand mark, in currentColor. */
function EditorIcon({ editor }) {
  return (
    <svg className="dshre-icon" data-editor={editor} viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      <path fill="currentColor" d={ICON_PATHS[editor] ?? ICON_PATHS.cursor} />
    </svg>
  )
}

function Panel({ editor, host, effectiveHost, uri, onClose, t }) {
  const ref = useRef(null)
  const [draft, setDraft] = useState(host)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.parentElement.contains(e.target)) onClose()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])
  const draftValid = draft.trim() === '' || validHost(draft.trim())
  const commitHost = () => {
    const value = draft.trim()
    if (value === '' || validHost(value)) setPrefs({ host: value })
  }
  const copy = async () => {
    if (!uri) return
    try {
      await navigator.clipboard.writeText(uri)
    } catch {
      const area = document.createElement('textarea')
      area.value = uri
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="dshre-panel" ref={ref} role="dialog" aria-label={t('panel.title')}>
      <div className="dshre-title">{t('panel.title')}</div>
      <div className="dshre-hint">{t('panel.intro')}</div>
      <label className="dshre-field">
        <span>{t('panel.editor')}</span>
        <select value={editor} onChange={(e) => setPrefs({ editor: e.target.value })}>
          {EDITORS.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </label>
      <label className="dshre-field">
        <span>{t('panel.host')}</span>
        <input
          type="text"
          value={draft}
          placeholder={effectiveHost}
          spellCheck={false}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitHost}
          onKeyDown={(e) => { if (e.key === 'Enter') commitHost() }}
          aria-invalid={!draftValid}
        />
      </label>
      <div className="dshre-hint">{draftValid ? t('panel.hostHint') : t('panel.hostInvalid')}</div>
      <div className="dshre-uri">{uri ?? t('panel.unavailable')}</div>
      <div className="dshre-actions">
        <button type="button" className="dshre-btn" disabled={!uri} onClick={() => void copy()}>{copied ? t('panel.copied') : t('panel.copy')}</button>
        {uri ? <a className="dshre-btn dshre-primary" href={uri} onClick={onClose}>{t('panel.open')}</a> : null}
      </div>
    </div>
  )
}

export function RemoteEditorButton(props) {
  const { sessionId, useSessions } = props
  const t = typeof props.t === 'function' ? props.t : fallbackT
  const cwd = typeof useSessions === 'function' ? useSessions((state) => state.byId[sessionId]?.cwd) : undefined
  const pref = useObservable(prefs)
  const fallback = useObservable(fallbackHost)
  const [open, setOpen] = useState(false)
  useEffect(loadInfo, [])
  if (!cwd) return null
  const host = pref.host.trim() || fallback
  const uri = remoteUri({ editor: pref.editor, host, path: cwd })
  const { name } = editorById(pref.editor)
  return (
    <div className="dshre-root">
      <div className="dshre-split">
        {uri
          ? <a className="dshre-main" href={uri} title={t('button.title', { editor: name, host, path: cwd })}><EditorIcon editor={pref.editor} />{name}</a>
          : <button type="button" className="dshre-main" onClick={() => setOpen(true)} title={t('button.setup')}><EditorIcon editor={pref.editor} />{name}</button>}
        <button type="button" className="dshre-chevron" aria-label={t('menu.label')} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.6" d="m4 6 4 4 4-4" /></svg>
        </button>
      </div>
      {open ? <Panel editor={pref.editor} host={pref.host} effectiveHost={fallback} uri={uri} onClose={() => setOpen(false)} t={t} /> : null}
    </div>
  )
}
