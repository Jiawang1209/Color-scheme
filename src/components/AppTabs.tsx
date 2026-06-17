import type { AppView } from '../state/view';

interface AppTabsProps {
  value: AppView;
  onChange: (v: AppView) => void;
}

export function AppTabs({ value, onChange }: AppTabsProps) {
  return (
    <div className="app-tabs">
      <button
        className={value === 'library' ? 'app-tab active' : 'app-tab'}
        onClick={() => onChange('library')}
      >
        配色库
      </button>
      <button
        className={value === 'picker' ? 'app-tab active' : 'app-tab'}
        onClick={() => onChange('picker')}
      >
        取色器
      </button>
      <button
        className={value === 'image' ? 'app-tab active' : 'app-tab'}
        onClick={() => onChange('image')}
      >
        图片取色
      </button>
    </div>
  );
}
