interface NSelectorProps {
  value: number;
  onChange: (n: number) => void;
}

const NS = [3, 4, 5, 6, 7, 8, 9];

export function NSelector({ value, onChange }: NSelectorProps) {
  return (
    <div className="n-selector">
      {NS.map((n) => (
        <button
          key={n}
          className={value === n ? 'active' : undefined}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
