import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { linkRung } from '../scripts/link-rung.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'rung-link-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const source = join(root, 'checkout', 'rung');
  const destination = join(root, 'home', 'skills', 'rung');
  mkdirSync(source, { recursive: true });
  writeFileSync(join(source, 'SKILL.md'), 'Current instructions');
  return { source, destination };
}

test('the linked install reflects source changes and relinking is idempotent', t => {
  const { source, destination } = fixture(t);
  assert.equal(linkRung(source, destination).changed, true);
  assert.equal(lstatSync(destination).isSymbolicLink(), true);
  writeFileSync(join(source, 'SKILL.md'), 'Updated instructions');
  assert.equal(readFileSync(join(destination, 'SKILL.md'), 'utf8'), 'Updated instructions');
  assert.equal(linkRung(source, destination).changed, false);
});

test('a copied installation is backed up outside discovery and its local anchors survive', t => {
  const { source, destination } = fixture(t);
  const anchor = 'references/anchors/writer.local.md';
  mkdirSync(dirname(join(destination, anchor)), { recursive: true });
  writeFileSync(join(destination, anchor), 'Local fixture material');
  writeFileSync(join(destination, 'SKILL.md'), 'Old instructions');
  const result = linkRung(source, destination);
  assert.equal(realpathSync(destination), realpathSync(source));
  assert.equal(readFileSync(join(destination, anchor), 'utf8'), 'Local fixture material');
  assert.equal(readFileSync(join(result.backup, 'SKILL.md'), 'utf8'), 'Old instructions');
  assert.equal(result.backup.startsWith(dirname(destination) + '/'), false);
});

test('different local anchors are never overwritten and the old install stays usable', t => {
  const { source, destination } = fixture(t);
  for (const dir of [source, destination]) mkdirSync(join(dir, 'anchors'), { recursive: true });
  writeFileSync(join(source, 'anchors/writer.local.md'), 'Source material');
  writeFileSync(join(destination, 'anchors/writer.local.md'), 'Installed material');
  assert.throws(() => linkRung(source, destination), /Different local anchor/);
  assert.equal(lstatSync(destination).isSymbolicLink(), false);
  assert.equal(readFileSync(join(destination, 'anchors/writer.local.md'), 'utf8'), 'Installed material');
  assert.equal(readFileSync(join(source, 'anchors/writer.local.md'), 'utf8'), 'Source material');
});

test('linking refuses a missing source or a destination containing the source', t => {
  const { source, destination } = fixture(t);
  assert.throws(() => linkRung(join(source, 'missing'), destination));
  assert.equal(existsSync(destination), false);
  assert.throws(() => linkRung(source, dirname(source)), /contains the source/);
  assert.equal(readFileSync(join(source, 'SKILL.md'), 'utf8'), 'Current instructions');
});
