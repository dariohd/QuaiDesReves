import { readdir } from 'node:fs/promises';
import { join, basename } from 'node:path';
import sharp from 'sharp';

const imagesDir = join(import.meta.dirname, '..', 'images');
const MAX_WIDTH = 1400;

const files = (await readdir(imagesDir)).filter(f => f.endsWith('.png'));

for (const file of files) {
  const input = join(imagesDir, file);
  const output = join(imagesDir, file.replace(/\.png$/i, '.webp'));

  let pipeline = sharp(input);
  const meta = await pipeline.metadata();
  if (meta.width > MAX_WIDTH) {
    pipeline = sharp(input).resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  await pipeline.webp({ quality: 82, effort: 6 }).toFile(output);
  const { size: webpSize } = await import('node:fs/promises').then((fs) => fs.stat(output));
  console.log(`${file} → ${basename(output)} (${Math.round(webpSize / 1024)} Ko)`);
}

const hero = join(imagesDir, 'hero-terrasse.png');
const ogOut = join(imagesDir, 'og-image.jpg');
await sharp(hero)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(ogOut);

console.log('og-image.jpg créé (1200×630)');
