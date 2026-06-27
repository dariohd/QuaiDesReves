import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let html = readFileSync(join(root, 'index.html'), 'utf8');

html = html.replace(
  /<img src="(images\/[^"]+\.png)"([^>]*)>/g,
  (_, src, rest) =>
    `<picture><source srcset="${src.replace('.png', '.webp')}" type="image/webp"><img src="${src}"${rest}></picture>`
);

writeFileSync(join(root, 'index.html'), html);
console.log('Images converties en <picture> WebP + PNG');
