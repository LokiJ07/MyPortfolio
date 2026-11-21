import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const at = file => join(root.pathname, file);
const html = readFileSync(at('index.html'), 'utf8');
const js = readFileSync(at('script.js'), 'utf8');

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML element IDs');

for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
  assert(ids.includes(target), 'Broken in-page link: #' + target);
}
for (const [, file] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (/^(?:https?:|mailto:|tel:|\/)/.test(file)) continue;
  assert(existsSync(at(file)), 'Missing linked file: ' + file);
}
for (const [, file] of js.matchAll(/image: '([^']+)'/g)) {
  assert(existsSync(at(file)), 'Missing certificate image: ' + file);
}

const cards = [...html.matchAll(/class="project-card"/g)];
assert.equal(cards.length, 9, 'Expected 9 project cards');
assert.equal([...html.matchAll(/data-certificate=/g)].length, 4, 'Expected four certificate controls');
assert(!html.includes('cdn.tailwindcss.com'), 'Runtime Tailwind CDN must not be used');
assert(!/\bonclick=/.test(html), 'Prefer unobtrusive JavaScript over inline handlers');

const imageCount = [...html.matchAll(/<img\b/g)].length;
const describedImages = [...html.matchAll(/<img\b[^>]*\balt="/g)].length;
assert.equal(describedImages, imageCount, 'All images must have alt text');

for (const tag of html.match(/<a\b[^>]*target="_blank"[^>]*>/g) || []) {
  assert(/rel="noopener noreferrer"/.test(tag), 'External target=_blank needs a safe rel attribute');
}
for (const name of ['NutriMap', 'Tabi-Tabi', 'RiftGuard', 'Echoes of Aether', 'LokiTunes', 'LokiVerse']) {
  assert(html.includes(name), 'Missing portfolio project: ' + name);
}

console.log('Portfolio checks passed: 9 projects, 4 certificates, valid local links and accessible markup basics.');
