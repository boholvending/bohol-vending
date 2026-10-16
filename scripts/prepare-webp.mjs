import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { rasterPattern, toWebp } from '../lib/webp-processor.mjs';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(e => e.isDirectory() ? walk(path.join(dir,e.name)) : path.join(dir,e.name)));
  return files.flat();
}
const replacements = [];
for (const file of await walk('public')) {
  if (!rasterPattern.test(file)) continue;
  const target = file + '.webp';
  let refresh = true;
  try { refresh = (await stat(file)).mtimeMs > (await stat(target)).mtimeMs; } catch {}
  if (refresh) await writeFile(target, await toWebp(await readFile(file)));
  replacements.push(['/' + file.replaceAll('\\','/').slice(7), '/' + target.replaceAll('\\','/').slice(7)]);
}
let changed = 0;
for (const dir of ['content','app','components','lib']) {
  for (const file of await walk(dir)) {
    if (!/\.(mdoc|tsx?|css|json)$/.test(file)) continue;
    const original = await readFile(file,'utf8');
    let text = original;
    for (const [old,next] of replacements) text = text.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w.])', 'g'), next);
    if (text !== original) { await writeFile(file,text); changed++; }
  }
}
console.log(`WebP: ${replacements.length} images checked; ${changed} reference files updated. Originals retained.`);
