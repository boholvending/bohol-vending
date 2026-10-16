import sharp from 'sharp';

export const rasterPattern = /\.(png|jpe?g|gif|avif|tiff?)$/i;
export async function toWebp(bytes) {
  return sharp(bytes, { animated: true, limitInputPixels: 80000000 })
    .rotate().webp({ quality: 90, effort: 4 }).toBuffer();
}

// Keep the source extension in the name to avoid collisions between a.jpg/a.png.
export async function convertCmsImages(payload) {
  if (!Array.isArray(payload?.additions)) return payload;
  const replacements = [];
  const originals = [];
  for (const item of payload.additions) {
    if (!/^public\/uploads\//.test(item.path) || !rasterPattern.test(item.path)) continue;
    if (item.path.split('/').includes('..')) throw new Error('Invalid image path');
    const bytes = Buffer.from(item.contents, 'base64url');
    if (bytes.length > 30 * 1024 * 1024) throw new Error('Image exceeds 30 MB');
    const converted = await toWebp(bytes);
    originals.push({ ...item });
    const old = item.path;
    item.path += '.webp';
    item.contents = converted.toString('base64url');
    replacements.push([old.slice('public'.length), item.path.slice('public'.length)]);
  }
  for (const item of payload.additions) {
    if (!/^content\//.test(item.path) || !/\.(mdoc|md|json|ya?ml)$/.test(item.path)) continue;
    let text = Buffer.from(item.contents, 'base64url').toString('utf8');
    for (const [old, next] of replacements) {
      text = text.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w.])', 'g'), next);
      // Keystatic image fields may store only the filename instead of a public URL.
      const name = old.split('/').pop();
      text = text.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w.])', 'g'), name + '.webp');
    }
    item.contents = Buffer.from(text).toString('base64url');
  }
  payload.additions.push(...originals);
  return payload;
}
