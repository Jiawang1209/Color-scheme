import type { Collection } from '../data/types';

interface CollectionFilterProps {
  value: Collection[];
  onChange: (cols: Collection[]) => void;
}

const COLLECTIONS: { id: Collection; label: string }[] = [
  { id: 'colorbrewer', label: 'ColorBrewer' },
  { id: 'viridis', label: 'Viridis' },
  { id: 'crameri', label: 'Crameri' },
  { id: 'journal', label: '期刊' },
];

export function CollectionFilter({ value, onChange }: CollectionFilterProps) {
  function toggle(id: Collection) {
    if (value.includes(id)) {
      onChange(value.filter((c) => c !== id));
    } else {
      onChange([...value, id]);
    }
  }

  return (
    <div className="collection-filter">
      {COLLECTIONS.map(({ id, label }) => (
        <label key={id}>
          <input
            type="checkbox"
            checked={value.includes(id)}
            onChange={() => toggle(id)}
          />
          {label}
        </label>
      ))}
    </div>
  );
}
