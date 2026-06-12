// Optimización NO destructiva de imágenes pesadas de /public.
// No toca los originales: escribe las versiones optimizadas (mismo nombre y
// formato, máx 1600px de ancho, PNG cuantizado / JPEG mozjpeg) en
// public-optimized/ replicando la estructura de carpetas.
//
// Uso:
//   node scripts/optimize-images.mjs            → genera public-optimized/
//   (revisar visualmente y luego aplicar con)
//   rsync -av public-optimized/ public/ && rm -rf public-optimized
import sharp from "sharp";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, statSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const MAX_WIDTH = 1600;
const OUT_DIR = "public-optimized";

const files = execSync(
  `find public -type f \\( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \\) -size +800k`,
  { encoding: "utf8" }
)
  .trim()
  .split("\n")
  .filter(Boolean);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const before = statSync(file).size;
  const input = readFileSync(file);
  const meta = await sharp(input).metadata();

  let pipeline = sharp(input);
  if ((meta.width ?? 0) > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const isPng = file.endsWith(".png");
  const buf = isPng
    ? await pipeline.png({ palette: true, quality: 90, compressionLevel: 9 }).toBuffer()
    : await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();

  if (buf.length < before) {
    const outPath = join(OUT_DIR, file.replace(/^public\//, ""));
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, buf);
    totalBefore += before;
    totalAfter += buf.length;
    console.log(
      `${file}: ${(before / 1024).toFixed(0)}KB → ${(buf.length / 1024).toFixed(0)}KB (${meta.width}px → ${Math.min(meta.width ?? 0, MAX_WIDTH)}px)`
    );
  } else {
    console.log(`${file}: sin mejora, no se genera copia`);
  }
}

console.log(
  `\nTotal optimizado: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB en ${OUT_DIR}/`
);
console.log("Para aplicar: rsync -av public-optimized/ public/ && rm -rf public-optimized");
