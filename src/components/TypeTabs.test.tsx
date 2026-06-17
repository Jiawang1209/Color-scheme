import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TypeTabs } from './TypeTabs';

describe('TypeTabs', () => {
  it('calls onChange with diverging when 发散 is clicked', () => {
    const onChange = vi.fn();
    render(<TypeTabs value="sequential" onChange={onChange} />);
    fireEvent.click(screen.getByText('发散'));
    expect(onChange).toHaveBeenCalledWith('diverging');
  });
});
