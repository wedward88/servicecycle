import { render, screen } from '@testing-library/react';

import Home from '../app/page';

describe('Home', () => {
  it('should render the home page', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', {
        name: /Welcome to ServiceCycle/i,
      })
    ).toBeInTheDocument();
  });

  it('should render get started button', () => {
    render(<Home />);
    expect(
      screen.getByRole('link', {
        name: 'Get started',
      })
    ).toBeInTheDocument();
  });
});
