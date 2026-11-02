# Security Policy

Please report vulnerabilities privately through GitHub's
[private vulnerability reporting](https://github.com/Edison-A-N/dsh-remote-editor/security/advisories/new)
rather than a public issue.

Relevant areas: the `/plugins/remote-editor/api/info` route (it must stay
behind DSH's login check and leak nothing beyond the account name), and the
link builder in `lib/links.js` (a host or path must not be able to change the
scheme or authority of the generated link).

Only the latest release is supported.
