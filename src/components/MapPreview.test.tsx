import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MapPreview } from './MapPreview';
describe('MapPreview', () => {
  it('renders a canvas map', () => {
    render(<MapPreview colors={['#e5f5f9','#99d8c9','#2ca25f']} cvd="normal" type="sequential" />);
    const el = screen.getByTestId('map');
    expect(el.tagName).toBe('CANVAS');
  });
  it('does not crash with empty colors', () => {
    expect(() => render(<MapPreview colors={[]} cvd="normal" type="sequential" />)).not.toThrow();
  });
});
