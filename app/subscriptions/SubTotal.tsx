import { Subscription } from './types';

type SubTotalProps = {
  userSubscriptions: Subscription[];
};

const SubTotal = ({ userSubscriptions }: SubTotalProps) => {
  const calcTotalCost = () => {
    let total = 0;

    for (let sub of userSubscriptions) {
      if (sub.cost) {
        total += parseFloat(sub.cost);
      }
    }

    return total.toFixed(2);
  };
  return (
    <div className="flex flex-col md:items-center w-full mt-10 space-y-10">
      <h1 className="text-4xl underline decoration-primary decoration-4">
        Total
      </h1>
      <div className="text-3xl text-accent">
        ${calcTotalCost()} /month
      </div>
    </div>
  );
};

export default SubTotal;
