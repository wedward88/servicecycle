import { getServerSession } from 'next-auth';

import { getUserSubscriptions } from '../actions/actions';
import SubForm from '../components/form/Form';
import { SubscriptionFormFields } from '../components/form/FormManifest';
import { authOptions } from '../utils/authOptions';
import SubTable from './SubTable';
import SubTotal from './SubTotal';

const SubscriptionPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error('User not authenticated');
  }

  // Get user and their subscriptions
  const userSubs = await getUserSubscriptions(session?.user?.email);

  const subs = userSubs?.subscriptions || [];
  const noSubs = subs.length === 0;

  return (
    <div className="flex flex-col items-center space-y-10 mt-5">
      <h1 className="flex w-full text-3xl items-start md:justify-center lg:justify-center">
        {userSubs!.name}&apos;s subscriptions
      </h1>
      <div className="flex flex-col items-start">
        <div className="flex items-center text-2xl">
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
            <SubTable userSubscriptions={subs} />
            <SubTotal userSubscriptions={subs} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
