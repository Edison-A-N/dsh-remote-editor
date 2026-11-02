/** `remote-editor` namespace dictionaries. Placeholders use `{name}`. */

export const NS = 'remote-editor'

export const en = {
  'button.title': 'Open {host}:{path} in {editor} on this computer',
  'button.setup': 'Set the SSH host',
  'menu.label': 'Local editor settings',
  'panel.title': 'Open in local editor',
  'panel.intro': 'The link is handed to the operating system of the computer running this browser; the editor then connects back to the server over Remote-SSH. That computer needs the editor with its Remote-SSH extension installed, and must be able to ssh to the server.',
  'panel.editor': 'Editor',
  'panel.host': 'SSH host',
  'panel.hostHint': 'A Host alias from ~/.ssh/config on this computer, or user@host. Leave empty to use the placeholder.',
  'panel.hostInvalid': 'Only letters, digits and . _ - @ : [ ] are allowed.',
  'panel.unavailable': 'No link: the host or the path is not usable.',
  'panel.copy': 'Copy link',
  'panel.copied': 'Copied',
  'panel.open': 'Open',
}

export const zh = {
  'button.title': '在本机 {editor} 打开 {host}:{path}',
  'button.setup': '设置 SSH 主机',
  'menu.label': '本机编辑器设置',
  'panel.title': '在本机编辑器打开',
  'panel.intro': '链接交给你这台电脑的系统处理，编辑器再通过 Remote-SSH 连回服务器。本机需要装好编辑器和 Remote-SSH 扩展，并且能 ssh 到这台服务器。',
  'panel.editor': '编辑器',
  'panel.host': 'SSH 主机',
  'panel.hostHint': '填本机 ~/.ssh/config 里的 Host 别名，或 user@host。留空就用占位符里的默认值。',
  'panel.hostInvalid': '只能包含字母、数字和 . _ - @ : [ ]',
  'panel.unavailable': '链接不可用：主机或路径不合法',
  'panel.copy': '复制链接',
  'panel.copied': '已复制',
  'panel.open': '打开',
}
