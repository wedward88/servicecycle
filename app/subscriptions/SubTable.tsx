'use client';
import { motion } from 'motion/react';

import Form from '../components/form/Form';
import { SubscriptionFormFields } from '../components/form/FormManifest';
import { Subscription } from './types';

interface SubTableProps {
  userSubscriptions: Subscription[];
}

const baseImageURL = 'https://www.themoviedb.org/t/p/w500';
const MotionTable = motion.table;
const MotionTr = motion.tr;

const SubTable: React.FC<SubTableProps> = ({ userSubscriptions }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, type: 'spring' },
    },
  };
  return (
    <div>
      {userSubscriptions && (
        <MotionTable
          className="table rounded-xl bg-base-200 mt-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <thead>
            <tr>
              <th>Name</th>

              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {userSubscriptions.map((sub) => (
              <MotionTr
                key={sub.id}
                className="hover:bg-base-300 last:hover:rounded-2xl font-bold"
                variants={itemVariants}
              >
                <td>
                  <div className="flex items-center gap-3">
                    {sub.streamingProvider && (
                      <img
                        src={`${baseImageURL}${sub.streamingProvider?.logoUrl}`}
                        alt={`${sub.streamingProvider.name} logo`}
                        className="w-8 h-8 rounded-lg"
                      />
                    )}
                    <div>
                      <div className="font-bold">
                        {sub.streamingProvider!.name}
                      </div>
                    </div>
                  </div>
                </td>

                <td>{sub.cost ? sub.cost.toString() : 'N/A'}</td>

                <td>
                  <Form
                    formTitle="Edit Subscription"
                    openText="Edit"
                    submitText="Save"
                    formFields={SubscriptionFormFields}
                    initialData={sub}
                  />
                </td>
              </MotionTr>
            ))}
          </tbody>
        </MotionTable>
      )}
    </div>
  );
};

export default SubTable;
