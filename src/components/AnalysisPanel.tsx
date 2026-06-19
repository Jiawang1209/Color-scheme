import { lightnessProfile, toGrayscale } from '../lib/color/analysis';

const CW = 620;
const CH = 200;
const PAD = 30;

export function AnalysisPanel({ colors }: { colors: string[] }) {
  if (!colors.length) return <div className="analysis-empty">无配色</div>;
  const Ls = lightnessProfile(colors);
  const n = colors.length;
  const x = (i: number) => PAD + (n === 1 ? (CW - 2 * PAD) / 2 : (i / (n - 1)) * (CW - 2 * PAD));
  const y = (l: number) => PAD + (1 - l / 100) * (CH - 2 * PAD);
  const linePts = Ls.map((l, i) => `${x(i)},${y(l)}`).join(' ');
  return (
    <div className="analysis-panel">
      <div className="analysis-block">
        <div className="analysis-title">亮度曲线 · L*</div>
        <div className="analysis-hint">理想的连续配色：亮度单调、均匀变化（彩虹/jet 类会起伏）</div>
        <svg data-testid="lstar-chart" className="lstar-chart" viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="xMidYMid meet">
          {[0, 50, 100].map((g) => (
            <g key={g}>
              <line className="lstar-grid" x1={PAD} x2={CW - PAD} y1={y(g)} y2={y(g)} />
              <text className="lstar-axis" x={PAD - 8} y={y(g) + 4} textAnchor="end">{g}</text>
            </g>
          ))}
          <polyline className="lstar-line" points={linePts} fill="none" />
          {Ls.map((l, i) => (
            <circle key={i} cx={x(i)} cy={y(l)} r={6} fill={colors[i]} stroke="#fff" strokeWidth={2} />
          ))}
        </svg>
      </div>
      <div className="analysis-block">
        <div className="analysis-title">灰度 / 打印预览</div>
        <div className="analysis-hint">黑白打印或复印后是否仍能区分各级</div>
        <div className="grayscale-strip">
          {colors.map((c, i) => (
            <div key={i} className="grayscale-swatch" data-testid="gray-swatch" style={{ background: toGrayscale(c) }} title={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
