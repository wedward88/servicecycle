import { Subscription } from './types';

type SubTotalProps = {
  userSubscriptions: Subscription[];
};

const SubTotal = ({ userSubscriptions }: SubTotalProps) => {
  const calcTotalCost = () => {
    let total = 0;

    for (const sub of userSubscriptions) {
      if (sub.cost) {
        total += parseFloat(sub.cost);
      }
    }

    return total.toFixed(2);
  };

  return (
    <div className="flex h-full flex-col justify-center px-6 py-8 md:px-8">
      <p className="text-sm uppercase tracking-[0.14em] text-secondary">
        Total
      </p>
      <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-primary md:text-5xl">
        ${calcTotalCost()}
      </p>
      <p className="mt-2 text-secondary">
        per month across {userSubscriptions.length} service
        {userSubscriptions.length === 1 ? '' : 's'}
      </p>
    </div>
  );
};

export default SubTotal;
