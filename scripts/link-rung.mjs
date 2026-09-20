// Link the installed skill to this checkout; keep local anchors and the old install.
import {
  constants, copyFileSync, existsSync, globSync, lstatSync, mkdirSync,
  mkdtempSync, readFileSync, realpathSync, renameSync, statSync, symlinkSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function linkRung(source, destination) {
  source = realpathSync(source);
  destination = resolve(destination);
  if (!statSync(join(source, 'SKILL.md')).isFile()) throw new Error('Source has no SKILL.md');
  const previous = lstatSync(destination, { throwIfNoEntry: false });
  if (existsSync(destination) && realpathSync(destination) === source) {
    return { source, destination, backup: null, changed: false };
  }
  // Never rename a directory containing the source into its own backup.
  const inside = relative(existsSync(destination) ? realpathSync(destination) : destination, source);
  if (inside === '' || (inside !== '..' && !inside.startsWith('../') && !inside.startsWith('..\\'))) {
    throw new Error('Destination contains the source checkout');
  }
  if (previous && !previous.isDirectory() && !previous.isSymbolicLink()) {
    throw new Error('Destination is neither a skill directory nor a symlink');
  }

  const anchors = existsSync(destination) ? globSync('**/*.local.md', { cwd: destination }) : [];
  // Check every collision before copying or replacing anything.
  for (const name of anchors) {
    const target = join(source, name);
    if (existsSync(target) && !readFileSync(target).equals(readFileSync(join(destination, name)))) {
      throw new Error(`Different local anchor already exists: ${name}`);
    }
  }
  for (const name of anchors) {
    const target = join(source, name);
    if (!existsSync(target)) {
      mkdirSync(dirname(target), { recursive: true });
      copyFileSync(join(destination, name), target, constants.COPYFILE_EXCL);
    }
  }

  mkdirSync(dirname(destination), { recursive: true });
  let backup = null;
  if (previous) {
    const backups = join(dirname(dirname(destination)), 'skill-backups');
    mkdirSync(backups, { recursive: true });
    backup = join(mkdtempSync(join(backups, 'rung-')), 'rung');
    renameSync(destination, backup);
  }
  try {
    symlinkSync(source, destination, 'dir');
  } catch (error) {
    if (backup) renameSync(backup, destination);
    throw error;
  }
  return { source, destination, backup, changed: true };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  if (process.argv.length > 3 || process.argv[2]?.startsWith('-')) {
    console.error('Usage: node scripts/link-rung.mjs [installed-skill-path]');
    process.exitCode = 1;
  } else {
    const source = fileURLToPath(new URL('../plugins/rung/skills/rung', import.meta.url));
    const destination = process.argv[2] ?? join(homedir(), '.claude', 'skills', 'rung');
    console.log(JSON.stringify(linkRung(source, destination), null, 2));
  }
}
