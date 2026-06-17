import type { CvdMode } from '../lib/color/cvd';
import { simulateCvd } from '../lib/color/cvd';

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
          style={{ background: simulateCvd(color, cvd) }}
          title={color}
          onClick={() => navigator.clipboard?.writeText(color)}
        >
          <span className="swatch-label">{color}</span>
        </div>
      ))}
    </div>
  );
}
