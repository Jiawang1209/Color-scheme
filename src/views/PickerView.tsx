import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { hexToRgb } from '../lib/color/convert';
import { hexToHsl } from '../lib/color/hsl';
import { nearestPaletteColor } from '../lib/color/nearest';
import { copyText } from '../lib/clipboard';

export function PickerView() {
  const [hex, setHex] = useState('#2166ac');

  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);
  const near = nearestPaletteColor(hex);

  const hasEyeDropper = 'EyeDropper' in window;

  const onEyedrop = async () => {
    try {
      const eye = new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper();
      const { sRGBHex } = await eye.open();
      setHex(sRGBHex);
    } catch { /* user cancelled */ }
  };

  const copy = (text: string) => copyText(text, `已复制 ${text}`);

  return (
    <div className="tool-page-shell">
      <div className="tool-page-header">
        <h1 className="tool-page-title">取色器</h1>
        <p className="tool-page-subtitle">选取任意颜色，查看 HEX / RGB / HSL，并匹配最接近的科研配色。</p>
      </div>

      <div className="picker-view">
        <div className="picker-left">
          <HexColorPicker color={hex} onChange={setHex} />
          <div
            className="picker-preview-swatch"
            style={{ background: hex }}
            aria-label={`当前颜色 ${hex}`}
          />
        </div>

        <div className="picker-right">
          <div className="picker-codes">
            <div className="picker-codes-label">颜色值</div>

            <div className="picker-code-row">
              <span className="picker-code-label">HEX</span>
              <span className="picker-code-value">
                <span data-testid="picker-hex">{hex}</span>
              </span>
              <button className="picker-copy-btn" onClick={() => copy(hex)} title="复制 HEX">
                复制
              </button>
            </div>

            <div className="picker-code-row">
              <span className="picker-code-label">RGB</span>
              <span className="picker-code-value">
                rgb({rgb.r}, {rgb.g}, {rgb.b})
              </span>
              <button
                className="picker-copy-btn"
                onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                title="复制 RGB"
              >
                复制
              </button>
            </div>

            <div className="picker-code-row">
              <span className="picker-code-label">HSL</span>
              <span className="picker-code-value">
                hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
              </span>
              <button
                className="picker-copy-btn"
                onClick={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                title="复制 HSL"
              >
                复制
              </button>
            </div>
          </div>

          <div className="picker-eyedropper">
            <button
              className="picker-eyedrop-btn"
              onClick={hasEyeDropper ? onEyedrop : undefined}
              disabled={!hasEyeDropper}
              title={
                hasEyeDropper ? '从屏幕拾取颜色' : '当前浏览器不支持，请用 Chrome/Edge'
              }
            >
              <span className="picker-eyedrop-icon">⊕</span>
              屏幕吸管
            </button>
          </div>

          <div className="nearest-box">
            <div className="nearest-box-label">最接近的配色库颜色</div>
            <div className="nearest-box-content">
              <div
                data-testid="nearest-swatch"
                className="nearest-swatch"
                style={{ background: near.hex }}
                aria-label={`最接近颜色 ${near.hex}`}
              />
              <div className="nearest-info">
                <span className="nearest-text">
                  最接近：{near.paletteId} · {near.hex}（ΔE {near.distance.toFixed(1)}）
                </span>
                <a
                  href={`?view=library&id=${near.paletteId}`}
                  className="nearest-link"
                >
                  在配色库中打开
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
