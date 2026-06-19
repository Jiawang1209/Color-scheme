import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Toaster } from './Toaster';
import { emitToast } from '../lib/clipboard';

describe('Toaster', () => {
  it('shows a toast when one is emitted', () => {
    render(<Toaster />);
    act(() => { emitToast('已复制 #2166ac'); });
    expect(screen.getByText(/已复制 #2166ac/)).toBeInTheDocument();
  });
});
