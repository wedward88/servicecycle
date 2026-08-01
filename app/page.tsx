'use client';

import { motion, useReducedMotion } from 'motion/react';

import BrandMark from './components/BrandMark';
import SignInButton from './components/SignInButton';
import {
  SearchMock,
  SubscriptionsMock,
  WatchListMock,
} from './components/landing/ProductMocks';
import { duration, easeOut, fadeUp } from './lib/motion';

const features = [
  {
    title: 'Track subscriptions',
    description:
      'Add your streaming services, set costs, and see your monthly total in one place.',
    Mock: SubscriptionsMock,
  },
  {
    title: 'Search TV & movies',
    description:
      'Look up titles and see which providers carry them—before you subscribe again.',
    Mock: SearchMock,
  },
  {
    title: 'Curate a watch list',
    description:
      'Save what you want to watch and know when you already have access.',
    Mock: WatchListMock,
  },
];

export default function Home() {
  const reduceMotion = useReducedMotion();

  const enter = (delay = 0) =>
    reduceMotion
      ? { duration: 0 }
      : { duration: duration.slow, ease: easeOut, delay };

  return (
    <div className="w-full">
      <section className="hero-atmosphere relative">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24">
          <div className="mx-auto flex w-full max-w-3xl items-start gap-3 text-left sm:gap-4">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={enter(0)}
              className="shrink-0 -mt-1 text-primary sm:-mt-1.5 md:-mt-2"
            >
              <BrandMark className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={enter(0)}
                className="font-display text-4xl font-medium leading-none tracking-tight text-primary brand-underline sm:text-5xl md:text-6xl"
              >
                BingeQueue
              </motion.p>
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={enter(0.07)}
                className="mt-6 font-display text-3xl font-medium leading-tight text-base-content sm:text-4xl"
              >
                Stop juggling streaming apps.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={enter(0.14)}
                className="mt-4 text-lg leading-relaxed text-secondary sm:text-xl"
              >
                Track what you pay for and find where to watch—without
                another forgotten subscription.
              </motion.p>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={enter(0.21)}
                className="mt-8"
              >
                <SignInButton className="btn btn-primary btn-lg px-8 font-body font-medium normal-case" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:px-12 lg:px-16">
        <div className="space-y-24 md:space-y-28">
          {features.map(({ title, description, Mock }, index) => (
            <motion.div
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={enter(0)}
              className={`flex flex-col gap-8 md:items-center md:gap-12 ${
                index % 2 === 1
                  ? 'md:flex-row-reverse'
                  : 'md:flex-row'
              }`}
            >
              <div className="md:w-2/5">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-base-content sm:text-3xl">
                  {title}
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-secondary">
                  {description}
                </p>
              </div>
              <div className="md:w-3/5">
                <Mock />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="hero-atmosphere border-t border-base-300 px-6 py-20 md:px-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-base-content sm:text-4xl">
            Start tracking today
          </h2>
          <p className="mt-3 text-lg text-secondary">
            Sign in and bring your subscriptions under control.
          </p>
          <SignInButton className="btn btn-primary btn-lg mt-8 px-8 font-body font-medium normal-case" />
        </div>
      </section>
    </div>
  );
}
