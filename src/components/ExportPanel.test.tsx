import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { ExportPanel } from './ExportPanel';

afterEach(cleanup);

const colors = ['#e5f5f9', '#99d8c9', '#2ca25f'];

describe('ExportPanel', () => {
  it('renders matplotlib code containing ListedColormap', () => {
    const { getByTestId } = render(<ExportPanel format="matplotlib" colors={colors} name="BuGn" onFormat={vi.fn()} />);
    expect(getByTestId('export-code').textContent).toContain('ListedColormap');
  });

  it('calls onFormat with ggplot when ggplot2 tab is clicked', () => {
    const onFormat = vi.fn();
    const { getByText } = render(<ExportPanel format="matplotlib" colors={colors} name="BuGn" onFormat={onFormat} />);
    fireEvent.click(getByText('ggplot2'));
    expect(onFormat).toHaveBeenCalledWith('ggplot');
  });
});
