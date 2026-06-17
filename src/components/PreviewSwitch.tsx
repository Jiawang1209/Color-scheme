interface PreviewSwitchProps {
  value: 'map' | 'chart';
  onChange: (v: 'map' | 'chart') => void;
}

export function PreviewSwitch({ value, onChange }: PreviewSwitchProps) {
  return (
    <div className="preview-switch">
      <button
        className={`preview-switch-btn${value === 'map' ? ' active' : ''}`}
        onClick={() => onChange('map')}
      >
        地图
      </button>
      <button
        className={`preview-switch-btn${value === 'chart' ? ' active' : ''}`}
        onClick={() => onChange('chart')}
      >
        图表
      </button>
    </div>
  );
}
