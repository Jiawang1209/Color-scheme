import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalysisPanel } from './AnalysisPanel';
describe('AnalysisPanel', () => {
  it('renders an L* chart and one grayscale swatch per color', () => {
    render(<AnalysisPanel colors={['#ffffb2', '#feb24c', '#b10026']} />);
    expect(screen.getByTestId('lstar-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('gray-swatch')).toHaveLength(3);
  });
});
