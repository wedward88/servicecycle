import { render, screen } from '@testing-library/react';

import Home from '../app/page';

describe('Home', () => {
  it('should render the home page', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', {
        name: /Stop juggling streaming apps/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText('ServiceCycle')).toBeInTheDocument();
  });

  it('should render get started button', () => {
    render(<Home />);
    const buttons = screen.getAllByRole('button', {
      name: 'Get started',
    });
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});
