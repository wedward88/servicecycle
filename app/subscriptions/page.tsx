import { getServerSession } from 'next-auth';

import { authOptions } from '../api/auth/[...nextauth]/route';
import SubForm from '../components/form/Form';
import SubTable from './SubTable';
import { SubscriptionFormFields } from '../components/form/FormManifest';
import SubTotal from './SubTotal';
import { getUserSubscriptions } from '../actions/actions';

const SubscriptionPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error('User not authenticated');
  }

  // Get user and their subscriptions
  const userSubs = await getUserSubscriptions(session?.user?.email);

  const subs = userSubs?.subscriptions || [];

  return (
    <div className="flex flex-col items-center space-y-10 mt-10">
      <h1 className="text-3xl">{userSubs!.name}'s Subscriptions</h1>
      <div className="flex flex-col items-start">
        <SubForm
          formTitle="Create New Subscription"
          openText="Create New"
          submitText="Save"
          formFields={SubscriptionFormFields}
        />
        <SubTable userSubscriptions={subs} />
        <SubTotal userSubscriptions={subs} />
      </div>
    </div>
  );
};

export default SubscriptionPage;
