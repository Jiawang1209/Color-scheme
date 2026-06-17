import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders swatches for the default palette', () => {
    render(<App />);
    expect(screen.getAllByTestId('swatch').length).toBeGreaterThan(0);
  });
  it('changing n keeps a valid palette rendered', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '7' }));
    expect(screen.getAllByTestId('swatch').length).toBeGreaterThan(0);
  });
});
