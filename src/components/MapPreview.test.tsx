import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MapPreview } from './MapPreview';
describe('MapPreview', () => {
  it('renders many country paths', () => {
    const { container } = render(
      <MapPreview colors={['#e5f5f9','#99d8c9','#2ca25f']} cvd="normal" type="sequential" />,
    );
    expect(container.querySelectorAll('path').length).toBeGreaterThan(50);
  });
  it('does not crash with empty colors', () => {
    const { container } = render(<MapPreview colors={[]} cvd="normal" type="sequential" />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
