# Paraglide: the first page after `vite dev` starts reloads itself

Minimal reproduction for `@inlang/paraglide-js` 3.2.2 with Vite 8.3.7 and `outputStructure: "virtual-modules"` (the Vite default).

## What happens

The first page opened after the dev server starts reloads itself right after `[vite] connected.`. Pages opened later do not.

On its first publication in `buildStart`, Paraglide's virtual messages plugin calls `reloadEnvironments(server)` (`src/bundler-plugins/virtual-messages.ts`), which sends `{ type: "full-reload" }` to every Vite environment. No browser is connected yet, so Vite keeps that message and delivers it to the first client that connects.

## Run it

```sh
npm ci
node repro.mjs
```

`repro.mjs` starts the dev server and connects to Vite's HMR socket the way a new browser tab does.

Actual:

```
HMR messages received by the first client: [ 'connected', 'full-reload' ]
BUG: the first page opened after start would reload itself
```

Expected:

```
HMR messages received by the first client: [ 'connected' ]
OK: no reload
```

## In a browser

1. `npm run dev`
2. Open the page in a new tab: it shows "Page loads in this tab: 2", because it reloaded itself once.
3. Open it in another new tab: it shows 1.

With DevTools "Preserve log" on, the console shows `Navigated to …` right after `[vite] connected.` on the first tab.
