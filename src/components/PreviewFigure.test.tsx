import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PreviewFigure } from './PreviewFigure';

describe('PreviewFigure', () => {
  it('renders an svg with 3 rects for sequential with 3 colors', () => {
    const { container } = render(
      <PreviewFigure colors={['#000000', '#888888', '#ffffff']} cvd="normal" type="sequential" />
    );
    expect(screen.getByTestId('preview')).toBeTruthy();
    expect(container.querySelectorAll('rect')).toHaveLength(3);
  });
});
