import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CvdToggle } from './CvdToggle';

describe('CvdToggle', () => {
  it('calls onChange with deutan when 绿色盲 is clicked', () => {
    const onChange = vi.fn();
    render(<CvdToggle value="normal" onChange={onChange} />);
    fireEvent.click(screen.getByText('绿色盲'));
    expect(onChange).toHaveBeenCalledWith('deutan');
  });
});
