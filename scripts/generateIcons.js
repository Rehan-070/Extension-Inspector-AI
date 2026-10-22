import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import zlib from 'zlib';

// Helper to compute CRC32 for PNG chunks
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xff];
  }
  return (c ^ -1) >>> 0;
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 8) : c >>> 8;
  }
  crcTable[n] = c;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4);
  data.copy(buf, 8);
  const crcVal = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crcVal, 8 + len);
  return buf;
}

function generateIconPNG(size) {
  const width = size;
  const height = size;

  // Raw RGBA buffer (width * height * 4) + scanline filter bytes (height)
  const rawData = Buffer.alloc(height * (width * 4 + 1));

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const nx = (x / width) * 2 - 1; // -1 to 1
      const ny = (y / height) * 2 - 1; // -1 to 1
      const dist = Math.sqrt(nx * nx + ny * ny);

      // Deep Dark Indigo/Violet Gradient Background with Rounded Corners
      let r = 15;
      let g = 23;
      let b = 42;
      let a = 255;

      // Rounded square mask
      const cornerDist = Math.max(Math.abs(nx), Math.abs(ny));
      if (cornerDist > 0.95 && dist > 1.1) {
        a = 0; // transparent corners
      }

      if (a > 0) {
        // Linear Background Gradient (Violet to Indigo)
        const grad = (ny + 1) / 2;
        r = Math.floor(15 + grad * 35);  // 15 to 50
        g = Math.floor(23 + grad * 15);  // 23 to 38
        b = Math.floor(42 + grad * 90);  // 42 to 132

        // Shield Shape Outline: y inside shield bounds
        const shieldWidth = 0.55 * (1 - (ny > 0 ? (ny * ny * 0.45) : 0));
        const insideShield = Math.abs(nx) < shieldWidth && ny > -0.65 && ny < 0.65;
        const shieldEdge = Math.abs(Math.abs(nx) - shieldWidth) < 0.08 && ny > -0.65 && ny < 0.65;

        if (insideShield) {
          // Purple/Indigo Shield Fill
          r = 99;
          g = 102;
          b = 241;
        }

        // Cyan Glowing AI Lens Ring in Center
        const lensDist = Math.sqrt(nx * nx + (ny + 0.05) * (ny + 0.05));
        const ring = Math.abs(lensDist - 0.28);
        if (ring < 0.09) {
          // Bright Cyan Accent
          r = 56;
          g = 189;
          b = 248;
        } else if (lensDist < 0.28) {
          // Core Lens Glow
          r = 139;
          g = 92;
          b = 246;
        }

        if (shieldEdge) {
          // Metallic Silver/Cyan Shield Border
          r = 224;
          g = 231;
          b = 255;
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  // PNG Header (Signature)
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bit depth
  ihdrData[9] = 6; // Color type 6 (RGBA)
  ihdrData[10] = 0; // Compression method
  ihdrData[11] = 0; // Filter method
  ihdrData[12] = 0; // Interlace method
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT Chunk (zlib compressed)
  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const sizes = [16, 48, 128];
const dirs = ['public/icons', 'dist/icons', 'icons'];

dirs.forEach((dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  sizes.forEach((sz) => {
    const pngBuf = generateIconPNG(sz);
    writeFileSync(resolve(dir, `icon${sz}.png`), pngBuf);
  });
});

console.log('Custom Raycast/Arc themed PNG icons (16, 48, 128) successfully generated!');
