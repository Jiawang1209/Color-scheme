import type { CvdMode } from '../lib/color/cvd';
import { simulateCvd } from '../lib/color/cvd';
import { copyText } from '../lib/clipboard';

interface SwatchStripProps {
  colors: string[];
  cvd: CvdMode;
}

export function SwatchStrip({ colors, cvd }: SwatchStripProps) {
  return (
    <div className="swatch-strip">
      {colors.map((color) => (
        <div
          key={color}
          data-testid="swatch"
          className="swatch"
          title={color}
          onClick={() => copyText(color)}
        >
          <div className="swatch-color" style={{ background: simulateCvd(color, cvd) }} />
          <span className="swatch-label">{color}</span>
        </div>
      ))}
    </div>
  );
}
