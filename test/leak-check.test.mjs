// The leak check, tested against the documentation it ships inside of.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { importLeakCheck } from './gate.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const { leaks, words, N } = await importLeakCheck(ROOT);

const ANCHOR = 'All non-trivial abstractions, to some degree, are leaky. ' +
  'Abstractions fail. Sometimes a little, sometimes a lot. There is leakage. ' +
  'Things go wrong. It happens all over the place when you have abstractions.';

test('the run length is the eight the document argues for', () => {
  assert.equal(N, 8);
});

test('a lift of eight words is a finding', () => {
  const found = leaks('He warned that abstractions fail sometimes a little sometimes a lot and we ignored him.', ANCHOR);
  assert.equal(found.length, 1);
  assert.equal(found[0].text, 'abstractions fail sometimes a little sometimes a lot');
});

test('seven words of ordinary English are not a finding', () => {
  assert.deepEqual(leaks('Things go wrong. It happens all over.', ANCHOR), []);
});

test('typography is not evidence: punctuation and case do not hide a lift', () => {
  const plain = 'abstractions fail sometimes a little sometimes a lot';
  const dressed = 'ABSTRACTIONS fail -- "sometimes" a little, (sometimes) a LOT';
  assert.equal(leaks(plain, ANCHOR).length, 1);
  assert.equal(leaks(dressed, ANCHOR).length, 1);
});

test('a lifted passage is reported once at its full length, never as overlapping runs', () => {
  const found = leaks(ANCHOR, ANCHOR);
  assert.equal(found.length, 1, 'the whole anchor is one finding');
  assert.equal(found[0].start, 0);
  assert.equal(found[0].length, words(ANCHOR).length);
});

test('two separate lifts are two findings', () => {
  const text = 'All non-trivial abstractions to some degree are leaky. ' +
    'Then a long stretch of entirely original writing that owes nobody anything at all here. ' +
    'It happens all over the place when you have abstractions.';
  assert.equal(leaks(text, ANCHOR).length, 2);
});

test('clean prose against a real anchor is clean', () => {
  assert.deepEqual(leaks('Every interface you build hides something, and the thing it hides gets out eventually.', ANCHOR), []);
});

test('the threshold is a setting the caller can move, as the document says', () => {
  assert.equal(leaks('Things go wrong. It happens all over.', ANCHOR, 6).length, 1);
});

test('words() folds case and drops punctuation', () => {
  assert.deepEqual(words('Hey -- "There", you!'), ['hey', 'there', 'you']);
});
