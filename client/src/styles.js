/** One style tag for the header button and its panel. Colors use --dsw-alias-* tokens so dark mode follows. */
const CSS = `
.dshre-root{position:relative;display:inline-flex;align-items:center;flex:none}
.dshre-split{box-sizing:border-box;display:inline-flex;align-items:stretch;height:24px;overflow:hidden;
  border:.5px solid var(--dsw-alias-border-l4,#ccc);border-radius:var(--dsw-radius-sm,6px);font-family:var(--dsw-font-family,inherit)}
.dshre-main,.dshre-chevron{display:inline-flex;align-items:center;justify-content:center;background:none;border:0;cursor:pointer;
  font-size:11px;line-height:16px;white-space:nowrap;color:var(--dsw-alias-label-primary,#333);text-decoration:none}
.dshre-main{gap:5px;padding:3px 7px 3px 6px}
.dshre-icon{flex:none;display:block}
.dshre-icon[data-editor=vscode-insiders]{color:#24bfa5}
.dshre-chevron{padding:3px 4px 3px 3px;border-left:.5px solid var(--dsw-alias-border-l4,#ccc);color:var(--dsw-alias-label-secondary,#888)}
.dshre-main:hover,.dshre-chevron:hover,.dshre-main:focus-visible,.dshre-chevron:focus-visible{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06))}
.dshre-panel{position:absolute;top:calc(100% + 6px);right:0;z-index:30;width:340px;display:flex;flex-direction:column;gap:8px;
  padding:12px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,#ddd);background:var(--dsw-alias-bg-layer-3,#fff);
  box-shadow:0 4px 16px rgb(0 0 0 / 24%);color:var(--dsw-alias-label-primary,#333);font-size:12px;line-height:18px}
.dshre-title{font-size:13px;font-weight:600}
.dshre-hint{color:var(--dsw-alias-label-secondary,#888)}
.dshre-field{display:flex;align-items:center;gap:8px}
.dshre-field>span{flex:none;width:56px;color:var(--dsw-alias-label-secondary,#888)}
.dshre-field select,.dshre-field input{flex:1;min-width:0;font:inherit;padding:4px 8px;border-radius:6px;
  border:1px solid var(--dsw-alias-border-l2,#ddd);background:transparent;color:inherit}
.dshre-field input[aria-invalid=true]{border-color:var(--dsw-alias-state-error-primary,#e5484d)}
.dshre-field select option{color:#000}
.dshre-uri{font-family:var(--dsw-font-family-mono,ui-monospace,monospace);font-size:11px;word-break:break-all;padding:6px 8px;
  border-radius:6px;background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.05));color:var(--dsw-alias-label-secondary,#666)}
.dshre-actions{display:flex;justify-content:flex-end;gap:8px}
.dshre-btn{font:inherit;padding:3px 12px;border-radius:6px;cursor:pointer;text-decoration:none;color:inherit;
  border:1px solid var(--dsw-alias-border-l2,#ddd);background:transparent}
.dshre-btn:disabled{opacity:.5;cursor:default}
.dshre-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06))}
.dshre-primary{border-color:var(--dsw-alias-label-primary,#333)}
`

const ID = 'dsh-remote-editor-styles'

export function injectStyles() {
  let el = document.getElementById(ID)
  if (!el) {
    el = document.createElement('style')
    el.id = ID
    document.head.appendChild(el)
  }
  el.textContent = CSS
}
