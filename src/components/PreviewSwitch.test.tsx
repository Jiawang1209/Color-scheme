import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreviewSwitch } from './PreviewSwitch';
describe('PreviewSwitch', () => {
  it('fires onChange with the clicked mode', () => {
    const onChange = vi.fn();
    render(<PreviewSwitch value="map" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: '图表' }));
    expect(onChange).toHaveBeenCalledWith('chart');
  });
});
