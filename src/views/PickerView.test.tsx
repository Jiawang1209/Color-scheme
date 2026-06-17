import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PickerView } from './PickerView';
describe('PickerView', () => {
  it('shows the current color hex and a nearest-library swatch', () => {
    render(<PickerView />);
    expect(screen.getByTestId('picker-hex').textContent).toMatch(/^#[0-9a-f]{6}$/i);
    expect(screen.getByTestId('nearest-swatch')).toBeInTheDocument();
  });
});
