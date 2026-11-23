# Jinx’s projects

A small dark project hub at https://jinx.xanderxx.xyz/. Pocket Wild is the first project.

## What is here

- `/`: the dark, responsive project hub. Only Pocket Wild is currently listed.
- `/pocket-wild/`: the independently maintained [Pocket Wild](https://github.com/JinxOnPurpose-Labs/pocket-wild) browser game, dark UI, unchanged simulation and save schema.
- The slashless `/pocket-wild` redirects to `/pocket-wild/`. Unknown paths return a real 404, not the game or a pretend success page.

The hub has no JavaScript, analytics, forms, cookies, account system, fonts from third parties or database. Images are local, including Jinx’s original cat avatar and an original pixel meadow illustration. The game executes locally and uses browser-local storage, with no gameplay requests. Cloudflare still handles normal hosting traffic under its own policies. There are no application world uploads or cross-domain save transfers.

**Important:** browser worlds belong to their web address and device. Old GitHub Pages worlds remain at https://jinxonpurpose-labs.github.io/pocket-wild/. Visiting the new domain does not move or erase them. Follow the old link to return to an old world.

## Build and verify

Node.js 22+, Git, no site dependencies:

```sh
git clone https://github.com/JinxOnPurpose-Labs/pocket-wild.git ../pocket-wild
npm ci --ignore-scripts
npm test
npm run build
npm audit --audit-level=high
python3 -m http.server 4178 --bind 127.0.0.1 --directory dist
```

`POCKET_WILD_DIR` can point to a different local clone. `projects.json` pins a full source revision plus SHA-256 hashes for exactly six public game files. The build reads those committed blobs, not the working tree, and fails before replacing output if a source/digest is wrong. It copies only `public/` and those explicit game files into generated `dist/`. No repository metadata, developer tools, credentials or private workspace files are published. CI independently checks out the pinned revision and builds/tests without secrets or deployment permission. When updating the pin, update the CI checkout `ref` too.

Optional external browser tooling, never installed or shipped by the game:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROMIUM_PATH=/path/to/chrome \
  EVIDENCE_DIR=/tmp/jinx-hub-check node scripts/browser-check.mjs
# Set DEMO_URL=https://jinx.xanderxx.xyz/ for the real site.
```

Checks include dark computed styles, 1440/390/320px layout, images, project links, keyboard focus/navigation, no hub scripts/storage/cookies/external requests and playable subpath rendering. Run Pocket Wild’s own `scripts/browser-check.mjs` with `DEMO_URL` set to the deployed game path for its full pointer/touch, keyboard, save/corrupt-storage, simulation and privacy regressions. Mobile is Chromium emulation, not a physical device claim.

## Cloudflare release

A new, **assets-only** Worker named `jinx-project-hub` owns only `jinx.xanderxx.xyz`. No Worker application bundle, D1, KV, background jobs, accounts, secrets, origin server, paid resource provisioning or wildcard zone route is needed. Existing sites, Workers, DDNS, games and unit retirement resources are outside this release. Static-host headers enforce same-origin assets/scripts, no network connections, no framing, no camera/microphone/location, nosniff and no-referrer. HTML/assets must revalidate, avoiding silent stale module mixes. `Cache-Control: public, no-transform` also prevents Cloudflare’s zone-wide automatic Web Analytics injection for these responses only, without changing other hostnames or disabling bot/security settings ([provider documentation](https://developers.cloudflare.com/web-analytics/get-started/)). Observability is configured for the host, with query strings redacted and invocation logs disabled; there is no application telemetry.

Use an existing authenticated **official `cf@1.0.0-beta.23`** toolchain, not a runtime patch. The included `cloudflare.config.ts`/`worker.json` records exact hosting scope. Export the intended `CLOUDFLARE_ACCOUNT_ID` explicitly. `CF_SDK_ROOT` may point to the installed `cf` package directory; otherwise the script resolves a local `cf` installation. `scripts/cloudflare-build.mjs` uses the official SDK’s configuration validator and Build Output writers, without inventing the beta output schema.

```sh
# First run unit/model and real-browser checks; inspect DNS and existing Workers for conflicts.
npm run cloudflare:build
cf deploy --prebuilt --mode production --no-provision --dry-run
# Review generated assets/config and exact commit; this command publishes only this Worker/domain:
cf deploy --prebuilt --mode production --no-provision
```

Do not enable CI auto-deployment without explicit authorization. Keep account IDs and credentials in the operator environment, never Git. Keep the public asset allowlist and pin/digest checks intact. Confirm deployment/version and hostname ownership before retrying a failed/ambiguous upload. After release, check actual HTTPS root, slash redirect, module MIME/bytes, CSP, unknown-path 404, project source revision and desktop/mobile game behavior. Provider certificate activation may take time; do not call it live merely because upload succeeded. Roll back with an intentional new forward source/deployment restoring a known-good pin, never a force push. Retain issues, branches and test/deployment evidence.
