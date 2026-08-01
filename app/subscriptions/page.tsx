'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { getUserSubscriptions } from '../actions/subscription/actions';
import SubForm from '../components/form/Form';
import { SubscriptionFormFields } from '../components/form/FormManifest';
import { useMainStore } from '../store/providers/main-store-provider';
import SubTable from './SubTable';
import SubTotal from './SubTotal';

const SubscriptionPage = () => {
  const { subscriptions, setSubscriptions } = useMainStore(
    (state) => state
  );

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    const fetchUserSubscriptions = async () => {
      const userEmail = session?.user?.email;
      if (typeof userEmail === 'string') {
        const userSubs = await getUserSubscriptions(userEmail);
        const subs = userSubs?.subscriptions || [];
        setSubscriptions(subs);
      } else {
        console.error('User email is not available');
      }
    };

    fetchUserSubscriptions();
  }, [session, status, setSubscriptions]);

  const noSubs = subscriptions.length === 0;
  const firstName = session?.user?.name?.split(' ')[0] || 'Your';

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
            Subscriptions
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-base-content md:text-4xl">
            {firstName}&apos;s monthly stack
          </h1>
        </div>
        <SubForm
          formTitle="Create New Subscription"
          openText="Create New"
          submitText="Save"
          formFields={SubscriptionFormFields}
        />
      </div>

      {noSubs ? (
        <div className="border border-base-300 surface px-6 py-10 text-secondary">
          <p className="text-lg">
            No subscriptions yet. Click{' '}
            <span className="font-medium text-primary">Create New</span>{' '}
            to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-0 overflow-hidden border border-base-300 lg:grid-cols-[1.5fr_1fr]">
          <div className="surface">
            <SubTable userSubscriptions={subscriptions} />
          </div>
          <div className="border-t border-base-300 surface-muted lg:border-l lg:border-t-0">
            <SubTotal userSubscriptions={subscriptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
