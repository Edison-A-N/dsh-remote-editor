window.__ModuleLoader__.load({ id: "dsh-remote-editor", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// client/src/index.js
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// client/src/Button.jsx
var import_react = require("react");

// lib/links.js
var EDITORS = [
  { id: "cursor", name: "Cursor", scheme: "cursor" },
  { id: "vscode", name: "VS Code", scheme: "vscode" },
  { id: "vscode-insiders", name: "VS Code Insiders", scheme: "vscode-insiders" },
  { id: "windsurf", name: "Windsurf", scheme: "windsurf" }
];
function editorById(id) {
  return EDITORS.find((editor) => editor.id === id) ?? EDITORS[0];
}
function validHost(host) {
  return typeof host === "string" && /^(?!-)[A-Za-z0-9._@:\[\]-]{1,253}$/.test(host);
}
function encodePath(path) {
  return path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
}
function hasDotSegment(path) {
  return path.split("/").some((segment) => segment === "." || segment === "..");
}
function remoteUri({ editor, host, path }) {
  if (!validHost(host)) return void 0;
  if (typeof path !== "string" || !path.startsWith("/") || hasDotSegment(path)) return void 0;
  const { scheme } = editorById(editor);
  return `${scheme}://vscode-remote/ssh-remote+${host}${encodePath(path)}`;
}
function defaultHost(user, pageHost) {
  if (!pageHost) return "";
  const host = pageHost.includes(":") && !pageHost.startsWith("[") ? `[${pageHost}]` : pageHost;
  return user ? `${user}@${host}` : host;
}

// client/src/stores.js
var KEY = "dsh-remote-editor:prefs";
var INFO = "/plugins/remote-editor/api/info";
function observable(initial) {
  let value = initial;
  const listeners = /* @__PURE__ */ new Set();
  return {
    get: () => value,
    set(next) {
      value = next;
      for (const fn of [...listeners]) fn();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };
}
function readPrefs() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return {
      editor: EDITORS.some((e) => e.id === raw.editor) ? raw.editor : EDITORS[0].id,
      host: typeof raw.host === "string" ? raw.host : ""
    };
  } catch {
    return { editor: EDITORS[0].id, host: "" };
  }
}
var prefs = observable(readPrefs());
function setPrefs(patch) {
  const next = { ...prefs.get(), ...patch };
  prefs.set(next);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
  }
}
var fallbackHost = observable(defaultHost(void 0, location.hostname));
var infoLoaded = false;
function loadInfo() {
  if (infoLoaded) return;
  infoLoaded = true;
  fetch(INFO, { credentials: "same-origin" }).then((res) => res.ok ? res.json() : void 0).then((info) => {
    if (info && typeof info.user === "string") fallbackHost.set(defaultHost(info.user, location.hostname));
  }).catch(() => {
  });
}

// client/src/icons.js
var ICON_PATHS = {
  cursor: "M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23",
  vscode: "M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z",
  "vscode-insiders": "M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z",
  windsurf: "M23.55 5.067c-1.2038-.002-2.1806.973-2.1806 2.1765v4.8676c0 .972-.8035 1.7594-1.7597 1.7594-.568 0-1.1352-.286-1.4718-.7659l-4.9713-7.1003c-.4125-.5896-1.0837-.941-1.8103-.941-1.1334 0-2.1533.9635-2.1533 2.153v4.8957c0 .972-.7969 1.7594-1.7596 1.7594-.57 0-1.1363-.286-1.4728-.7658L.4076 5.1598C.2822 4.9798 0 5.0688 0 5.2882v4.2452c0 .2147.0656.4228.1884.599l5.4748 7.8183c.3234.462.8006.8052 1.3509.9298 1.3771.313 2.6446-.747 2.6446-2.0977v-4.893c0-.972.7875-1.7593 1.7596-1.7593h.003a1.798 1.798 0 0 1 1.4718.7658l4.9723 7.0994c.4135.5905 1.05.941 1.8093.941 1.1587 0 2.1515-.9645 2.1515-2.153v-4.8948c0-.972.7875-1.7594 1.7596-1.7594h.194a.22.22 0 0 0 .2204-.2202v-4.622a.22.22 0 0 0-.2203-.2203Z"
};

// client/src/locales.js
var NS = "remote-editor";
var en = {
  "button.title": "Open {host}:{path} in {editor} on this computer",
  "button.setup": "Set the SSH host",
  "menu.label": "Local editor settings",
  "panel.title": "Open in local editor",
  "panel.intro": "The link is handed to the operating system of the computer running this browser; the editor then connects back to the server over Remote-SSH. That computer needs the editor with its Remote-SSH extension installed, and must be able to ssh to the server.",
  "panel.editor": "Editor",
  "panel.host": "SSH host",
  "panel.hostHint": "A Host alias from ~/.ssh/config on this computer, or user@host. Leave empty to use the placeholder.",
  "panel.hostInvalid": "Only letters, digits and . _ - @ : [ ] are allowed.",
  "panel.unavailable": "No link: the host or the path is not usable.",
  "panel.copy": "Copy link",
  "panel.copied": "Copied",
  "panel.open": "Open"
};
var zh = {
  "button.title": "\u5728\u672C\u673A {editor} \u6253\u5F00 {host}:{path}",
  "button.setup": "\u8BBE\u7F6E SSH \u4E3B\u673A",
  "menu.label": "\u672C\u673A\u7F16\u8F91\u5668\u8BBE\u7F6E",
  "panel.title": "\u5728\u672C\u673A\u7F16\u8F91\u5668\u6253\u5F00",
  "panel.intro": "\u94FE\u63A5\u4EA4\u7ED9\u4F60\u8FD9\u53F0\u7535\u8111\u7684\u7CFB\u7EDF\u5904\u7406\uFF0C\u7F16\u8F91\u5668\u518D\u901A\u8FC7 Remote-SSH \u8FDE\u56DE\u670D\u52A1\u5668\u3002\u672C\u673A\u9700\u8981\u88C5\u597D\u7F16\u8F91\u5668\u548C Remote-SSH \u6269\u5C55\uFF0C\u5E76\u4E14\u80FD ssh \u5230\u8FD9\u53F0\u670D\u52A1\u5668\u3002",
  "panel.editor": "\u7F16\u8F91\u5668",
  "panel.host": "SSH \u4E3B\u673A",
  "panel.hostHint": "\u586B\u672C\u673A ~/.ssh/config \u91CC\u7684 Host \u522B\u540D\uFF0C\u6216 user@host\u3002\u7559\u7A7A\u5C31\u7528\u5360\u4F4D\u7B26\u91CC\u7684\u9ED8\u8BA4\u503C\u3002",
  "panel.hostInvalid": "\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u548C . _ - @ : [ ]",
  "panel.unavailable": "\u94FE\u63A5\u4E0D\u53EF\u7528\uFF1A\u4E3B\u673A\u6216\u8DEF\u5F84\u4E0D\u5408\u6CD5",
  "panel.copy": "\u590D\u5236\u94FE\u63A5",
  "panel.copied": "\u5DF2\u590D\u5236",
  "panel.open": "\u6253\u5F00"
};

// client/src/Button.jsx
var import_jsx_runtime = require("react/jsx-runtime");
function fallbackT(key, vars) {
  return (en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => String(vars?.[k] ?? ""));
}
function useObservable(source) {
  return (0, import_react.useSyncExternalStore)(source.subscribe, source.get, source.get);
}
function EditorIcon({ editor }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { className: "dshre-icon", "data-editor": editor, viewBox: "0 0 24 24", width: "13", height: "13", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { fill: "currentColor", d: ICON_PATHS[editor] ?? ICON_PATHS.cursor }) });
}
function Panel({ editor, host, effectiveHost, uri, onClose, t }) {
  const ref = (0, import_react.useRef)(null);
  const [draft, setDraft] = (0, import_react.useState)(host);
  const [copied, setCopied] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.parentElement.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  const draftValid = draft.trim() === "" || validHost(draft.trim());
  const commitHost = () => {
    const value = draft.trim();
    if (value === "" || validHost(value)) setPrefs({ host: value });
  };
  const copy = async () => {
    if (!uri) return;
    try {
      await navigator.clipboard.writeText(uri);
    } catch {
      const area = document.createElement("textarea");
      area.value = uri;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshre-panel", ref, role: "dialog", "aria-label": t("panel.title"), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshre-title", children: t("panel.title") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshre-hint", children: t("panel.intro") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dshre-field", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("panel.editor") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", { value: editor, onChange: (e) => setPrefs({ editor: e.target.value }), children: EDITORS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: e.id, children: e.name }, e.id)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dshre-field", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("panel.host") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          type: "text",
          value: draft,
          placeholder: effectiveHost,
          spellCheck: false,
          onChange: (e) => setDraft(e.target.value),
          onBlur: commitHost,
          onKeyDown: (e) => {
            if (e.key === "Enter") commitHost();
          },
          "aria-invalid": !draftValid
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshre-hint", children: draftValid ? t("panel.hostHint") : t("panel.hostInvalid") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshre-uri", children: uri ?? t("panel.unavailable") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshre-actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshre-btn", disabled: !uri, onClick: () => void copy(), children: copied ? t("panel.copied") : t("panel.copy") }),
      uri ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "dshre-btn dshre-primary", href: uri, onClick: onClose, children: t("panel.open") }) : null
    ] })
  ] });
}
function RemoteEditorButton(props) {
  const { sessionId, useSessions } = props;
  const t = typeof props.t === "function" ? props.t : fallbackT;
  const cwd = typeof useSessions === "function" ? useSessions((state) => state.byId[sessionId]?.cwd) : void 0;
  const pref = useObservable(prefs);
  const fallback = useObservable(fallbackHost);
  const [open, setOpen] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(loadInfo, []);
  if (!cwd) return null;
  const host = pref.host.trim() || fallback;
  const uri = remoteUri({ editor: pref.editor, host, path: cwd });
  const { name } = editorById(pref.editor);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshre-root", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshre-split", children: [
      uri ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", { className: "dshre-main", href: uri, title: t("button.title", { editor: name, host, path: cwd }), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorIcon, { editor: pref.editor }),
        name
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "dshre-main", onClick: () => setOpen(true), title: t("button.setup"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorIcon, { editor: pref.editor }),
        name
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshre-chevron", "aria-label": t("menu.label"), "aria-expanded": open, onClick: () => setOpen((v) => !v), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { viewBox: "0 0 16 16", width: "10", height: "10", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { fill: "none", stroke: "currentColor", strokeWidth: "1.6", d: "m4 6 4 4 4-4" }) }) })
    ] }),
    open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { editor: pref.editor, host: pref.host, effectiveHost: fallback, uri, onClose: () => setOpen(false), t }) : null
  ] });
}

// client/src/styles.js
var CSS = `
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
`;
var ID = "dsh-remote-editor-styles";
function injectStyles() {
  let el = document.getElementById(ID);
  if (!el) {
    el = document.createElement("style");
    el.id = ID;
    document.head.appendChild(el);
  }
  el.textContent = CSS;
}

// client/src/index.js
var inject = ["slots", "locale"];
function apply(ctx) {
  injectStyles();
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "remote-editor: dictionaries");
  const t = ctx.locale.bind(NS);
  ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
    name: "conversation.session.header.utilities",
    id: "remote-editor",
    // Right after the official open-in-app button (order -10).
    order: -9,
    locale: NS,
    label: () => t("panel.title")
  }, RemoteEditorButton));
}
return module.exports; } });
//# sourceMappingURL=client.js.map
