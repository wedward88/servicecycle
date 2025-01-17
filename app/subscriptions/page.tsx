import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

import NewSubForm from '../components/Form';
import { subscriptionFormFields } from './FormManifest';
import prisma from '@/prisma/client';

const SubscriptionPage = async () => {
  const session = await getServerSession(authOptions);

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
      <NewSubForm
        formTitle="Create New Subscription"
        openText="Create New"
        submitText="Save"
        formFields={subscriptionFormFields}
      />
      {userSubs && (
        <ul>
          {userSubs.map((sub) => (
            <li key={sub.id}>
              <h2>{sub.provider}</h2>
              <p>{sub.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubscriptionPage;
