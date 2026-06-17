import type { PaletteType } from '../data/types';

interface TypeTabsProps {
  value: PaletteType;
  onChange: (t: PaletteType) => void;
}

const TABS: { type: PaletteType; label: string }[] = [
  { type: 'sequential', label: '连续' },
  { type: 'diverging', label: '发散' },
  { type: 'qualitative', label: '分类' },
];

export function TypeTabs({ value, onChange }: TypeTabsProps) {
  return (
    <div className="type-tabs">
      {TABS.map(({ type, label }) => (
        <button
          key={type}
          className={value === type ? 'active' : undefined}
          onClick={() => onChange(type)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
