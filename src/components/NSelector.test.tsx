import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NSelector } from './NSelector';

describe('NSelector', () => {
  it('calls onChange with 7 when button 7 is clicked', () => {
    const onChange = vi.fn();
    render(<NSelector value={5} onChange={onChange} />);
    fireEvent.click(screen.getByText('7'));
    expect(onChange).toHaveBeenCalledWith(7);
  });
});
