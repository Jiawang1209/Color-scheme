import type { ExportFormat } from '../lib/export/index';
import { exportCode } from '../lib/export/index';

interface ExportPanelProps {
  format: ExportFormat;
  colors: string[];
  name: string;
  onFormat: (f: ExportFormat) => void;
}

const FORMATS: { fmt: ExportFormat; label: string }[] = [
  { fmt: 'hex', label: 'HEX' },
  { fmt: 'rgb', label: 'RGB' },
  { fmt: 'matplotlib', label: 'matplotlib' },
  { fmt: 'ggplot', label: 'ggplot2' },
  { fmt: 'plotly', label: 'plotly' },
  { fmt: 'r', label: 'R' },
];

export function ExportPanel({ format, colors, name, onFormat }: ExportPanelProps) {
  const code = exportCode(format, colors, name);
  return (
    <div className="export-panel">
      <div className="export-tabs">
        {FORMATS.map(({ fmt, label }) => (
          <button
            key={fmt}
            className={format === fmt ? 'active' : undefined}
            onClick={() => onFormat(fmt)}
          >
            {label}
          </button>
        ))}
      </div>
      <pre data-testid="export-code">{code}</pre>
      <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(code)}>
        复制
      </button>
    </div>
  );
}
