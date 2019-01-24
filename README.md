# UIE: hosting and tooling

## Today

### `src`

Pros:

- no size limitation, possibly multiple files
- bring your own build process
- live preview
- can use browser storage of the domain
- can do same-domain AJAX with no CORS

Cons:

- bring your own build process (no best practices)
- bring your own hosting (+ maintain it)
- live preview from `localhost` requires disabling `mixed-content` checking
- the slowest one (at least one HTTP call to the `extension.html`)
- __impossible to implement sane CSP__
- very hard to share (you need to `PUT /extensions` and run a server)
- absolute lack of control for us

### `srcdoc`

Pros:

- faster (possibly no HTTP at all if everything is bundled)
- ease of distribution (just `PUT /extensions`)
- no need for servers
- __plays well with CSP__
- can be used with the Web App (no tooling needed at all)
- can do AJAX to CORS-enabled endpoints
- we could potentially inspect extensions and their code

Cons:

- size limitation: __200kB__
- bring your own __very custom__ build process
- cannot use browser storage at all

### unpkg.com

We use unpkg.com to host UI Extensions SDK and we refer to it in examples using 3rd party libraries.

Issues:

- we rely on a service we don't control; if it's down, UI Extensions that don't bundle the SDK or use dependencies hosted there are down; there was already an outage in 2019
- caching issues: in the worst case scenario, due to unpkg's caching, it may take up to 4h for caches to invalidate; it slows down releases and makes hotfixes unpredictable

### Legacy styles, UIE SDK v2 (before Oct 19, 2016)

- UIE SDK v2 is hosted on a legacy Github page
- UIE SDK v2 legacy styles are hosted on the same Github page
- v3 legacy styles are packaged to the npm package and delivered via unpkg


## Moving forward

### Forma

- Forma guarantees visual consistency with the Web App
- Forma is a modern, pragmatic and productive React UI library
- Forma should be the default and the only promoted way of building interfaces for UI Extensions

### Opinionated dependencies and build process

- Since Forma requires React which is de-facto standard for building webapps nowadays, we should treat React + React DOM + Forma as the default stack
- This should be the only stack we provide tooling for

### `script` hosting

UI Extension - API entity:

```javascript
{
  sys: { type: 'Extension', id: 'eid' },
  extension: {
    name: 'test',
    // Choose one of: src, srcdoc, script
    src: '...',
    srcdoc: '...',
    script: {
      // String, JavaScript of a UMD build of a library
      // with a default export.
      // Limit to 512kB.
      source: '.........',
      // true or false, indicates dev mode
      dev: true,
      // List of dependencies. Only exact versions.
      dependencies: {
        react: '16.7.0',
        'react-dom': '16.7.0',
        '@contentful/forma-36-react-components': '2.0.0'
      }
    }
  }
}
```

UI Extension - `extension.json` file:

```javascript
{
  name: 'test',
  script: {
    entry: 'src/index.js',
    dev: true,
    dependencies: {
      react: '16.7.0',
      'react-dom': '16.7.0',
      '@contentful/forma-36-react-components': '2.0.0'
    }
  }
}
```

## The tool

Assume CLI tool `uie-tool`. It can be a part of the Contentful CLI or a separate project.

```bash
$ uie-tool init # creates a new project using our recommended stack
$ uie-tool connect # allows to connect to a UIE in dev mode
$ uie-tool publish # publish a new version
```

Demo.

## Rendering of the `script` extensions in the Web App

- We know all extensions upfront
- As soon as we start loading an entry using an extension with `script`, read `extension.script.dependencies` and fetch dependencies (as text) from a CDN to the memory and cache aggressively
- render the extension in an `<iframe>` with srcdoc using the template below:

```html
<!DOCTYPE html>
<meta charset="utf8">
<body></body>
<script>
/* React UMD bundle contents */
</script>
<script>
/* ReactDOM UMD bundle contents */
</script>
<script>
/* Forma UMD bundle contents */
</script>
<script>
/* UIE SDK bundle contents */
</script>
<script>
/* extension.script.source */
</script>
<script>
window.contentfulExtension.init(window.__uiextension__)
</script>
```

Completely transparent to user, no HTTP at all.

## CDN and legacy assets

- we need to setup out own CDN (S3 bucket + CloudFront distribution will suffice)
- we need to communicate timeline for removal of v2 and legacy styles (1 year?) and end of support for v2


## Extending `srcdoc`-backed UIE offering

- HTTP proxy
- secrets for HTTP proxy
- in-browser storage
- server-side storage
- OAuth flows (auth providers)
