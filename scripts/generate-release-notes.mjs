#!/usr/bin/env node
// ponytail: builds Firebase release notes from conventional commits since <range>.
// Reads commit subjects, groups by type (feat/fix/refactor/perf), drops the rest.
// Truncates to 480 chars (Firebase hard limit is 500) with a marker showing hidden count.

import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const LIMIT = 480;
const range = process.argv[2] ?? 'HEAD';

const log = execSync(
  `git log --pretty=format:"%s" ${range} | grep -E "^(feat|fix|refactor|perf):" || true`,
  { encoding: 'utf-8' },
).trim();

if (!log) {
  writeFileSync('release-notes.md', 'Build sin cambios funcionales.');
  process.exit(0);
}

const buckets = { feat: [], fix: [], refactor: [], perf: [] };
for (const line of log.split('\n')) {
  const match = line.match(/^(\w+):\s*(.*)$/);
  if (match && buckets[match[1]]) buckets[match[1]].push(match[2].trim());
}

const headers = {
  feat: '### Novedades',
  fix: '### Correcciones',
  refactor: '### Cambios internos',
  perf: '### Rendimiento',
};

const flat = [];
for (const type of Object.keys(headers)) {
  for (const msg of buckets[type]) flat.push({ type, msg });
}

const render = (entries) => {
  const lines = [];
  const seen = new Set();
  for (const { type, msg } of entries) {
    if (!seen.has(type)) {
      seen.add(type);
      lines.push(headers[type]);
    }
    lines.push(`- ${msg.charAt(0).toUpperCase()}${msg.slice(1)}`);
  }
  return lines.join('\n');
};

const renderWithMarker = (entries, hidden) =>
  `${render(entries)}\n- _(y ${hidden} más)_`;

let shown = flat.length;
let result = render(flat);
while (result.length > LIMIT && shown > 0) {
  shown -= 1;
  result = renderWithMarker(flat.slice(0, shown), flat.length - shown);
}

writeFileSync('release-notes.md', result || `Build con ${flat.length} commits.`);
