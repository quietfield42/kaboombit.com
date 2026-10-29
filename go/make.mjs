// Writes go/<channel>/index.html for each channel. Run: node go/make.mjs
// To add a channel, add it to CHANNELS and run again.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// path: the page at go/<path>. source (default: path)/medium/campaign/content become the utm_* tags in the Google
// Play referrer (and the App Store ct= tag is the path). Links only: no pixels, no cookies.
const PAID = { medium: 'paid_social', campaign: 'launch_test' };
const CHANNELS = [
  { path: 'meta', source: 'meta', ...PAID },
  { path: 'meta-a', source: 'meta', ...PAID, content: 'a' },
  { path: 'meta-b', source: 'meta', ...PAID, content: 'b' },
  { path: 'tiktok', source: 'tiktok', ...PAID },
  { path: 'tiktok-a', source: 'tiktok', ...PAID, content: 'a' },
  { path: 'tiktok-b', source: 'tiktok', ...PAID, content: 'b' },
  { path: 'google', source: 'google', medium: 'paid_search', campaign: 'launch_test' },
  { path: 'ig', medium: 'social' },
  { path: 'fb', medium: 'social' },
  { path: 'yt', medium: 'social' },
  { path: 'tt', medium: 'social' },
  { path: 'groups', medium: 'social' },
  { path: 'press', medium: 'referral' },
];
const here = dirname(fileURLToPath(import.meta.url));

const attr = (k, v) => (v ? ` data-${k}="${v}"` : '');
const page = (ch) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Get Kaboombit</title>
<link rel="icon" href="../../assets/icon-32.png" sizes="32x32">
<link rel="stylesheet" href="../../assets/site.css">
<style>
.go{max-width:560px;margin:0 auto;padding:48px 20px 64px;text-align:center}
.go img.mascot{width:min(220px,60vw);height:auto}
.go .stores{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:26px}
.go .is-soon{opacity:.55;cursor:default;pointer-events:none}
</style>
</head>
<body data-channel="${ch.path}"${attr('source', ch.source)}${attr('medium', ch.medium)}${attr('campaign', ch.campaign)}${attr('content', ch.content)}>
<header class="site-header"><div class="wrap"><a class="brand" href="../../" aria-label="Kaboombit home"><img src="../../assets/wordmark.webp" alt="Kaboombit" width="116" height="42"></a></div></header>
<main id="main" class="go">
<img class="mascot" src="../../assets/kaboomby-wave.webp" alt="Kaboomby waving" width="220" height="220">
<h1>Get Kaboombit</h1>
<p class="lead">Turn your child's drawings into a little animated movie.</p>
<div class="stores">
<a class="btn btn-primary" id="go-apple" href="../../">App Store</a>
<a class="btn btn-primary" id="go-play" href="../../">Google Play</a>
</div>
<p id="go-note" hidden>Coming soon to the App Store and Google Play.</p>
<p><a href="../../">See how it works</a></p>
</main>
<script src="../../assets/go.js"></script>
<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "063f82b47e2a4304b2804ebc5d55719b"}'></script>
</body>
</html>
`;

for (const ch of CHANNELS) {
  const out = join(here, ch.path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page(ch));
  console.log('wrote', out);
}
