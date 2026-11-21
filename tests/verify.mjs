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
assert.equal([...html.matchAll(/data-certificate=/g)].length, 5, 'Expected four training certificates and one award');
assert(html.includes('certificates/nutrimap-most-promising-technology.webp'), 'NutriMap award evidence must be linked from portfolio');
assert(html.includes('id="featured"'), 'Missing featured work section');
assert(html.includes('id="experience"'), 'Missing experience and education timeline');
assert(html.includes('Most Promising Technology Award'), 'Missing verified capstone award');
assert.equal([...html.matchAll(/class="feature-card"/g)].length, 3, 'Expected 3 featured projects');
assert.equal([...html.matchAll(/class="timeline-entry"/g)].length, 3, 'Expected education, award and OJT milestones');
assert.equal([...html.matchAll(/class="phone-previews"/g)].length, 1, 'Missing screenshots area');
assert(html.includes('LokiTunes/main/assets/screenshots/home.jpg'), 'Missing genuine app home capture');
assert(html.includes('LokiTunes/main/assets/screenshots/now-playing.jpg'), 'Missing genuine Now Playing capture');
const resumePath = at('assets/resume/Louie_Jay_Laspona_Resume.pdf');
assert(existsSync(resumePath), 'Resume PDF missing');
const resume = readFileSync(resumePath);
assert(resume.subarray(0, 8).toString() === '%PDF-1.4', 'Invalid resume PDF header');
assert(resume.length > 2500, 'Resume PDF unexpectedly small');

assert(html.includes('certificates/nutrimap-award-original-photo.webp'), 'Original NutriMap certificate photo should remain accessible');
assert(html.includes('Most Promising Technology Award · 2026'), 'Hero should mention the award');
assert(html.includes('Award-winning capstone'), 'NutriMap card should feature award distinction');
assert(html.includes('AI-generated'), 'Clearly disclose that the enhanced preview is AI-generated');
assert(js.includes("modalCaption.hidden = id !== 'award'"), 'Award preview must disclose its provenance');
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

console.log('Portfolio checks passed: 9 projects, 3 featured projects, 3 milestones, a resume PDF, and valid local links.');
