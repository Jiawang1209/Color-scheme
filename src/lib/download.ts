export function paletteSvg(colors: string[], name: string): string {
  const sw = 80, h = 80, pad = 12, labelH = 22, titleH = 30;
  const w = Math.max(colors.length * sw, sw);
  const W = w + pad * 2;
  const H = titleH + h + labelH + pad;
  const rects = colors.map((c, i) => {
    const x = pad + i * sw;
    return `  <rect x="${x}" y="${titleH}" width="${sw}" height="${h}" fill="${c}"/>\n` +
      `  <text x="${x + sw / 2}" y="${titleH + h + 16}" font-family="monospace" font-size="11" text-anchor="middle" fill="#555">${c}</text>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n` +
    `  <rect width="${W}" height="${H}" fill="#ffffff"/>\n` +
    `  <text x="${pad}" y="20" font-family="sans-serif" font-size="15" font-weight="600" fill="#1a1d27">${name}</text>\n` +
    `${rects}\n</svg>`;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadSvg(name: string, svg: string) {
  downloadBlob(`${name}.svg`, new Blob([svg], { type: 'image/svg+xml' }));
}

export async function downloadPngFromSvg(name: string, svg: string, scale = 2) {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = url; });
    const canvas = document.createElement('canvas');
    canvas.width = img.width * scale; canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d');
    if (ctx) { ctx.scale(scale, scale); ctx.drawImage(img, 0, 0); }
    canvas.toBlob((b) => { if (b) downloadBlob(`${name}.png`, b); });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export function downloadCanvasPng(name: string, canvas: HTMLCanvasElement) {
  canvas.toBlob((b) => { if (b) downloadBlob(`${name}.png`, b); });
}
