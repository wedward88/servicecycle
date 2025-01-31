import { getUserSubscriptions } from '../actions/actions';
import { validateSessionUser } from '../actions/utils';
import SearchSection from './SearchSection';

const SearchPage = async () => {
  const user = await validateSessionUser();

  if (!user) {
    throw new Error('User not found.');
  }
  const userSubs = await getUserSubscriptions(user.email!);

  if (!userSubs) {
    throw new Error('Failed to fetch user subscriptions');
  }

  const subscriptions: Set<number> = new Set();

  for (const item of userSubs.subscriptions) {
    subscriptions.add(item.streamingProvider.providerId);
  }

  return (
    <div className="flex flex-col items-start md:items-center lg:items-center space-y-10">
      <SearchSection user={user} subscriptions={subscriptions} />
    </div>
  );
};

export default SearchPage;
