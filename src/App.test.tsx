import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
describe('App shell', () => {
  it('starts on the library view with swatches', () => {
    render(<App />);
    expect(screen.getAllByTestId('swatch').length).toBeGreaterThan(0);
  });
  it('switches to the picker view', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '取色器' }));
    expect(screen.getByTestId('picker-hex')).toBeInTheDocument();
  });
});
