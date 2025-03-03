import { useSession } from 'next-auth/react';

import { useMainStore } from '@/app/store/providers/main-store-provider';
import SubscriptionPage from '@/app/subscriptions/page';
import { render, screen } from '@testing-library/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('../app/actions/subscription/actions', () => ({
  getUserSubscriptions: jest.fn(),
}));

jest.mock('../app/store/providers/main-store-provider', () => ({
  useMainStore: jest.fn(),
}));

describe('SubscriptionPage', () => {
  const mockSubscriptions = [
    {
      id: 1,
      cost: '12.99',
      streamingProvider: {
        name: 'Netflix',
        id: 1,
        logoUrl: 'test.com',
      },
    },
    {
      id: 2,
      cost: '10.99',
      streamingProvider: {
        name: 'Max',
        id: 2,
        logoUrl: 'test.com',
      },
    },
  ];

  beforeEach(() => {
    // Mock the session data
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { name: 'Mark Scout', email: 'markscout@lumon.com' },
      },
      status: 'authenticated',
    });

    const setSubscriptions = jest.fn();
    (useMainStore as jest.Mock).mockReturnValue({
      subscriptions: mockSubscriptions,
      setSubscriptions,
    });
  });

  it('should display user name and subscriptions', async () => {
    render(<SubscriptionPage />);

    expect(
      screen.getByText("Mark Scout's subscriptions")
    ).toBeInTheDocument();
  });

  it('should list the Subscriptions in a table', async () => {
    render(<SubscriptionPage />);

    mockSubscriptions.forEach((sub) => {
      expect(
        screen.getByText(sub.streamingProvider.name)
      ).toBeInTheDocument();

      expect(screen.getByText(sub.cost)).toBeInTheDocument();
    });
    const editButtons = screen.getAllByText('Edit');
    expect(editButtons).toHaveLength(mockSubscriptions.length);
  });

  it('should render a Create New button', async () => {
    render(<SubscriptionPage />);

    expect(
      screen.getByRole('button', {
        name: 'Create New',
      })
    ).toBeInTheDocument();
  });
});
