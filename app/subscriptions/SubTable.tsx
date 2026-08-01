'use client';
import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';

import Form from '../components/form/Form';
import { SubscriptionFormFields } from '../components/form/FormManifest';
import { fadeIn, transitionBase } from '../lib/motion';
import { Subscription } from './types';

interface SubTableProps {
  userSubscriptions: Subscription[];
}

const baseImageURL = 'https://www.themoviedb.org/t/p/w500';

const SubTable: React.FC<SubTableProps> = ({ userSubscriptions }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-secondary">
          Name
        </p>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-secondary">
          Cost
        </p>
      </div>
      <motion.ul
        className="divide-y divide-base-300"
        variants={fadeIn}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        transition={reduceMotion ? { duration: 0 } : transitionBase}
      >
        {userSubscriptions.map((sub) => (
          <li
            key={sub.id}
            className="flex items-center justify-between gap-4 px-5 py-3.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              {sub.streamingProvider && (
                <Image
                  src={`${baseImageURL}${sub.streamingProvider?.logoUrl}`}
                  alt={`${sub.streamingProvider.name} logo`}
                  width={100}
                  height={100}
                  className="h-8 w-8 rounded-md"
                />
              )}
              <span className="truncate font-medium text-base-content">
                {sub.streamingProvider!.name}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="tabular-nums text-secondary">
                {sub.cost ? `$${sub.cost}` : 'N/A'}
              </span>
              <Form
                formTitle="Edit Subscription"
                openText="Edit"
                submitText="Save"
                formFields={SubscriptionFormFields}
                initialData={sub}
              />
            </div>
          </li>
        ))}
      </motion.ul>
    </div>
  );
};

export default SubTable;
