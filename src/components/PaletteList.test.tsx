import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaletteList } from './PaletteList';
import { palettes } from '../data/index';

describe('PaletteList', () => {
  it('calls onSelect with palette id when row is clicked', () => {
    const onSelect = vi.fn();
    const filtered = palettes.filter((p) => p.id === 'BuGn');
    render(
      <PaletteList
        palettes={filtered}
        selectedId=""
        n={5}
        cvd="normal"
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith('BuGn');
  });
});
