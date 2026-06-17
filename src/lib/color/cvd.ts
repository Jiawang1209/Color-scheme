import { hexToRgb, rgbToHex } from './convert';

export type CvdMode = 'normal' | 'protan' | 'deutan' | 'tritan';

// sRGB <-> linear
const toLin = (c: number) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const toSrgb = (l: number) => {
  const s = l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055;
  return s * 255;
};

// Viénot 1999 simulation matrices (operate on linear RGB).
const M: Record<Exclude<CvdMode, 'normal'>, number[][]> = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.011820, 0.042940, 0.968881],
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.303900],
  ],
};

export function simulateCvd(hex: string, mode: CvdMode): string {
  if (mode === 'normal') return hex;
  const { r, g, b } = hexToRgb(hex);
  const lin = [toLin(r), toLin(g), toLin(b)];
  const m = M[mode];
  const out = m.map((row) => row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2]);
  return rgbToHex({ r: toSrgb(out[0]), g: toSrgb(out[1]), b: toSrgb(out[2]) });
}
