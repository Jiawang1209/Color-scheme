import type { PaletteType } from '../data/types';
import type { CvdMode } from '../lib/color/cvd';
import { simulateCvd } from '../lib/color/cvd';

interface PreviewFigureProps {
  colors: string[];
  cvd: CvdMode;
  type: PaletteType;
}

const WIDTH = 300;
const HEIGHT = 60;

export function PreviewFigure({ colors, cvd, type }: PreviewFigureProps) {
  const n = colors.length;

  if (type === 'qualitative') {
    const barW = n > 0 ? WIDTH / n : WIDTH;
    return (
      <svg data-testid="preview" width={WIDTH} height={HEIGHT}>
        {colors.map((color, i) => {
          const barH = HEIGHT * (0.4 + 0.6 * ((i % 3) / 2));
          return (
            <rect
              key={i}
              x={i * barW}
              y={HEIGHT - barH}
              width={barW - 2}
              height={barH}
              fill={simulateCvd(color, cvd)}
            />
          );
        })}
      </svg>
    );
  }

  // sequential / diverging: colorbar
  const rectW = n > 0 ? WIDTH / n : WIDTH;
  return (
    <svg data-testid="preview" width={WIDTH} height={HEIGHT}>
      {colors.map((color, i) => (
        <rect
          key={i}
          x={i * rectW}
          y={0}
          width={rectW}
          height={HEIGHT}
          fill={simulateCvd(color, cvd)}
        />
      ))}
    </svg>
  );
}
