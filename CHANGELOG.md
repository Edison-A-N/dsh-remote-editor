# Changelog

## 0.1.0 (2026-11-02)

First release.

- Session-header button that opens the workspace in Cursor, VS Code, VS Code
  Insiders or Windsurf on the browser's computer through
  `<scheme>://vscode-remote/ssh-remote+<host><path>` links.
- Settings panel for the editor and SSH host, stored in `localStorage`, with
  link preview and copy.
- Default host `<server account>@<page host>` from a login-fenced
  `GET /plugins/remote-editor/api/info`.
- English and Chinese UI.
