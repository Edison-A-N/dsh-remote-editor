/**
 * dsh-remote-editor browser half: one `conversation.session.header.utilities`
 * entry next to the official "Open In..." button. The slot passes
 * `sessionId` and `useSessions`, the same props the official button reads
 * the workspace directory (`cwd`) from, plus `t` bound to this plugin's
 * locale namespace.
 */
import { RemoteEditorButton } from './Button.jsx'
import { en, NS, zh } from './locales.js'
import { injectStyles } from './styles.js'

export const inject = ['slots', 'locale']

export function apply(ctx) {
  injectStyles()
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'remote-editor: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
    name: 'conversation.session.header.utilities',
    id: 'remote-editor',
    // Right after the official open-in-app button (order -10).
    order: -9,
    locale: NS,
    label: () => t('panel.title'),
  }, RemoteEditorButton))
}
