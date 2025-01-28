import { getServerSession } from 'next-auth';

import { getUserSubscriptions } from '../actions/actions';
import { authOptions } from '../utils/authOptions';
import SearchForm from './SearchForm';

const SearchPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error('User not authenticated');
  }

  const userSubs = await getUserSubscriptions(session?.user?.email);

  if (!userSubs) {
    throw new Error('Failed to fetch user subscriptions');
  }

  const subscriptions: Set<number> = new Set();

  for (const item of userSubs.subscriptions) {
    subscriptions.add(item.streamingProvider.providerId);
  }

  return (
    <div className="flex flex-col items-start md:items-center lg:items-center space-y-10">
      <h1 className="text-2xl pl-[8px]">
        Search for shows or movies
      </h1>
      <SearchForm subscriptions={subscriptions} />
    </div>
  );
};

export default SearchPage;
