import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SafetyFilter } from './SafetyFilter';

describe('SafetyFilter', () => {
  it('calls onChange with cb flipped when 色盲安全 is toggled', () => {
    const onChange = vi.fn();
    render(<SafetyFilter value={{ cb: false, print: false, grey: false }} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('色盲安全'));
    expect(onChange).toHaveBeenCalledWith({ cb: true, print: false, grey: false });
  });
});
