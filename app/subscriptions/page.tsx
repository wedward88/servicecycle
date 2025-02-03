'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { getUserSubscriptions } from '../actions/actions';
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
      // Get user and their subscriptions
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

  return (
    <div className="flex flex-col items-start md:items-center space-y-10 mt-5">
      <h1 className="flex w-full text-2xl md:text-3xl items-start md:justify-center">
        {session?.user?.name}&apos;s subscriptions
      </h1>
      <div className="flex flex-col items-start">
        <div className="flex items-center text-xl md:text-2xl">
          {noSubs && 'Click'}
          <SubForm
            formTitle="Create New Subscription"
            openText="Create New"
            submitText="Save"
            formFields={SubscriptionFormFields}
          />
          {noSubs && 'to get started.'}
        </div>
        {!noSubs && (
          <div>
            <SubTable userSubscriptions={subscriptions} />
            <SubTotal userSubscriptions={subscriptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
