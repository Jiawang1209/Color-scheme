interface SafetyValue {
  cb: boolean;
  print: boolean;
  grey: boolean;
}

interface SafetyFilterProps {
  value: SafetyValue;
  onChange: (v: SafetyValue) => void;
}

export function SafetyFilter({ value, onChange }: SafetyFilterProps) {
  return (
    <div className="safety-filter">
      <label>
        <input
          type="checkbox"
          checked={value.cb}
          onChange={() => onChange({ ...value, cb: !value.cb })}
        />
        色盲安全
      </label>
      <label>
        <input
          type="checkbox"
          checked={value.print}
          onChange={() => onChange({ ...value, print: !value.print })}
        />
        打印友好
      </label>
      <label>
        <input
          type="checkbox"
          checked={value.grey}
          onChange={() => onChange({ ...value, grey: !value.grey })}
        />
        灰度安全
      </label>
    </div>
  );
}
