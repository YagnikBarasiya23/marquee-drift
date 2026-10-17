import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
for(const file of ['dist/marquee-drift.js','dist/marquee-drift.umd.cjs']){const size=gzipSync(readFileSync(file)).length;console.log(`${file}: ${size} bytes gzip`);if(size>=8192)throw Error('8 KiB budget exceeded');}
