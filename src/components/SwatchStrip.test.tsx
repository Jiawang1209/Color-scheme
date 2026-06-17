import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SwatchStrip } from './SwatchStrip';

describe('SwatchStrip', () => {
  it('renders one swatch per color', () => {
    render(<SwatchStrip colors={['#000000', '#ffffff']} cvd="normal" />);
    expect(screen.getAllByTestId('swatch')).toHaveLength(2);
  });
});
