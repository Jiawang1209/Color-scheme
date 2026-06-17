import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppTabs } from './AppTabs';
describe('AppTabs', () => {
  it('fires onChange with the clicked view', () => {
    const onChange = vi.fn();
    render(<AppTabs value="library" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: '取色器' }));
    expect(onChange).toHaveBeenCalledWith('picker');
  });
});
