import { useState } from 'react';
import type { ExportFormat } from '../lib/export/index';
import { exportCode } from '../lib/export/index';
import { copyText } from '../lib/clipboard';

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
  { fmt: 'css', label: 'CSS' },
  { fmt: 'd3', label: 'D3' },
  { fmt: 'tailwind', label: 'Tailwind' },
  { fmt: 'matlab', label: 'MATLAB' },
];

export function ExportPanel({ format, colors, name, onFormat }: ExportPanelProps) {
  const code = exportCode(format, colors, name);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyText(code, '已复制代码');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

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
      <button
        className={`copy-btn${copied ? ' copied' : ''}`}
        onClick={handleCopy}
      >
        {copied ? '已复制 ✓' : '复制'}
      </button>
    </div>
  );
}
