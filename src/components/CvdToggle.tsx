import type { CvdMode } from '../lib/color/cvd';

interface CvdToggleProps {
  value: CvdMode;
  onChange: (m: CvdMode) => void;
}

const MODES: { mode: CvdMode; label: string }[] = [
  { mode: 'normal', label: '正常' },
  { mode: 'protan', label: '红色盲' },
  { mode: 'deutan', label: '绿色盲' },
  { mode: 'tritan', label: '蓝色盲' },
];

export function CvdToggle({ value, onChange }: CvdToggleProps) {
  return (
    <div className="cvd-toggle">
      {MODES.map(({ mode, label }) => (
        <button
          key={mode}
          className={value === mode ? 'active' : undefined}
          onClick={() => onChange(mode)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
