import { useState, useRef, useEffect } from 'react';
import type { Rgb } from '../lib/color/convert';
import type { ExportFormat } from '../lib/export/index';
import { medianCut } from '../lib/color/extract';
import { nearestPalette } from '../lib/color/nearest';
import { SwatchStrip } from '../components/SwatchStrip';
import { ExportPanel } from '../components/ExportPanel';

export function ImageView() {
  const [colors, setColors] = useState<string[]>([]);
  const [n, setN] = useState(6);
  const [thumb, setThumb] = useState<string | null>(null);
  const [fmt, setFmt] = useState<ExportFormat>('matplotlib');
  const [dragging, setDragging] = useState(false);
  const pixelsRef = useRef<Rgb[]>([]);

  const handleFile = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 100 / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      const { data } = ctx.getImageData(0, 0, w, h);
      const pixels: Rgb[] = [];
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue;
        pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
      }
      pixelsRef.current = pixels;
      setThumb(canvas.toDataURL());
      setColors(medianCut(pixels, n));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  useEffect(() => {
    if (pixelsRef.current.length) setColors(medianCut(pixelsRef.current, n));
  }, [n]);

  const rec = colors.length ? nearestPalette(colors) : null;

  return (
    <div className="image-view">
      <div
        className={`drop-zone${dragging ? ' drop-zone--active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        {thumb ? (
          <img src={thumb} alt="预览" className="image-thumb" />
        ) : (
          <div className="drop-zone-hint">
            <span className="drop-zone-icon">⬆</span>
            <span>拖拽图片到此处</span>
            <span className="drop-zone-sub">或点击下方按钮选择文件</span>
          </div>
        )}
      </div>

      <div className="image-controls">
        <label className="upload-label">
          上传图片
          <input
            type="file"
            accept="image/*"
            aria-label="上传图片"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
        </label>

        <div className="slider-row">
          <span className="slider-label">提取颜色数</span>
          <input
            type="range"
            role="slider"
            min={3}
            max={10}
            value={n}
            aria-label="提取颜色数"
            onChange={(e) => setN(Number(e.target.value))}
          />
          <span className="slider-count">{n}</span>
        </div>
      </div>

      {colors.length > 0 && (
        <div className="image-results">
          <div className="image-swatch-wrap">
            <SwatchStrip colors={colors} cvd="normal" />
          </div>

          <ExportPanel format={fmt} colors={colors} name="extracted" onFormat={setFmt} />

          {rec && (
            <div className="nearest-box">
              <div className="nearest-box-label">最接近的科研配色</div>
              <div className="nearest-box-content">
                <div className="nearest-info">
                  <span className="nearest-text">{rec.paletteId}</span>
                  <a
                    href={`?view=library&id=${rec.paletteId}`}
                    className="nearest-link"
                  >
                    在配色库中查看
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
