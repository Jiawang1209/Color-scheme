import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CollectionFilter } from './CollectionFilter';

describe('CollectionFilter', () => {
  it('calls onChange with viridis added when Viridis checkbox is clicked', () => {
    const onChange = vi.fn();
    render(<CollectionFilter value={['colorbrewer']} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Viridis'));
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(['viridis']));
  });
});
