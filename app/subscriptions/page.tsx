import { getServerSession } from 'next-auth';
import prisma from '@/prisma/client';

import { authOptions } from '../api/auth/[...nextauth]/route';
import SubForm from '../components/form/Form';
import SubTable from './SubTable';
import { SubscriptionFormFields } from '../components/form/FormManifest';

const SubscriptionPage = async () => {
  const session = await getServerSession(authOptions);

  // Get user and their subscriptions
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    include: {
      subscriptions: true,
    },
  });

  const userSubs = user?.subscriptions || [];

  return (
    <div>
      <h1>Your Subscriptions</h1>
      <SubForm
        formTitle="Create New Subscription"
        openText="Create New"
        submitText="Save"
        formFields={SubscriptionFormFields}
      />
      <SubTable userSubscriptions={userSubs} />
    </div>
  );
};

export default SubscriptionPage;
