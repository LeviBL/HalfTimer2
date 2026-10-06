import { deflateSync } from "node:zlib";

// Generate the clock on a transparent canvas without an image-library dependency.
export function createFaviconPng(): Buffer {
  const size = 192;
  const pixels = Buffer.alloc(size * (size * 4 + 1));
  const distanceToHand = (x: number, y: number, ax: number, ay: number, bx: number, by: number) => {
    const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)));
    return Math.hypot(x - ax - t * (bx - ax), y - ay - t * (by - ay));
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let coverage = 0;
      for (let sy = 0; sy < 4; sy++) {
        for (let sx = 0; sx < 4; sx++) {
          const px = x + (sx + 0.5) / 4;
          const py = y + (sy + 0.5) / 4;
          const ring = Math.abs(Math.hypot(px - 96, py - 96) - 72) <= 9;
          const hands = distanceToHand(px, py, 96, 54, 96, 96) <= 9 || distanceToHand(px, py, 96, 96, 126, 120) <= 9;
          if (ring || hands) coverage++;
        }
      }
      const offset = y * (size * 4 + 1) + 1 + x * 4;
      pixels[offset] = 30;
      pixels[offset + 1] = 41;
      pixels[offset + 2] = 59;
      pixels[offset + 3] = Math.round(255 * coverage / 16);
    }
  }

  const chunk = (type: string, data: Buffer) => {
    const body = Buffer.concat([Buffer.from(type), data]);
    let crc = 0xffffffff;
    for (const byte of body) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const checksum = Buffer.alloc(4);
    checksum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
    return Buffer.concat([length, body, checksum]);
  };

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(pixels)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
