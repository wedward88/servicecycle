import { getServerSession } from 'next-auth';
import prisma from '@/prisma/client';

import { authOptions } from '../api/auth/[...nextauth]/route';
import SubForm from '../components/form/Form';
import SubTable from './SubTable';
import { SubscriptionFormFields } from '../components/form/FormManifest';
import SubTotal from './SubTotal';

const SubscriptionPage = async () => {
  const session = await getServerSession(authOptions);

  // Get user and their subscriptions
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    include: {
      subscriptions: {
        include: {
          streamingProvider: true,
        },
      },
    },
  });

  const userSubs = user?.subscriptions || [];

  return (
    <div className="flex flex-col items-center space-y-10 mt-10">
      <h1 className="text-3xl">{user!.name}'s Subscriptions</h1>
      <div className="flex flex-col items-start">
        <SubForm
          formTitle="Create New Subscription"
          openText="Create New"
          submitText="Save"
          formFields={SubscriptionFormFields}
        />
        <SubTable userSubscriptions={userSubs} />
        <SubTotal userSubscriptions={userSubs} />
      </div>
    </div>
  );
};

export default SubscriptionPage;
