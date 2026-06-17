import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageView } from './ImageView';
describe('ImageView', () => {
  it('renders an upload control and a color-count slider', () => {
    render(<ImageView />);
    expect(screen.getByLabelText('上传图片')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });
});
