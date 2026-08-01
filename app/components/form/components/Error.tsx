'use client';

import { motion, useReducedMotion } from 'motion/react';

import { fadeIn, transitionBase } from '@/app/lib/motion';

const Error = ({ message }: { message: string }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={fadeIn}
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      transition={reduceMotion ? { duration: 0 } : transitionBase}
      role="alert"
      className="flex h-12 alert alert-error text-sm text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
    </motion.div>
  );
};

export default Error;
