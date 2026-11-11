# Paraglide: the first page after `vite dev` starts reloads itself

Minimal reproduction for `@inlang/paraglide-js` 3.2.2 with Vite 8.3.7 and `outputStructure: "virtual-modules"` (the Vite default).

## Steps

1. `npm ci`
2. `npm run dev`
3. Open the page in a new tab. It shows **"Page loads in this tab: 2"**: the page reloaded itself once, right after the Vite client connected.
4. Open the page in another new tab. It shows **1**.

Every restart of `npm run dev` repeats this for the first tab. Expected: 1 in both tabs.

The counter is kept in `sessionStorage`, so use a new tab each time: reloading the same tab by hand also counts.

## Why

On its first publication in `buildStart`, Paraglide's virtual messages plugin calls `reloadEnvironments(server)` (`src/bundler-plugins/virtual-messages.ts`), which sends `{ type: "full-reload" }` to every Vite environment. No browser is connected yet, so Vite keeps that message and delivers it to the first client that connects.

## Headless check

`node repro.mjs` starts the dev server and connects to Vite's HMR socket the way a new tab does. It prints `[ 'connected', 'full-reload' ]` today and `[ 'connected' ]` once the first publication no longer reloads.
