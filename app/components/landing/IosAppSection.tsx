'use client';

import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';

import BrandWordmark from '@/app/components/BrandWordmark';
import { duration, easeOut } from '@/app/lib/motion';

const bullets = [
  'Monthly subscription total in one place',
  'Search TV & movies by provider',
  'Watch list with a Home Screen widget',
];

const screenshots = [
  {
    src: '/landing/ios-subscriptions.png',
    alt: 'BingeQueue iOS subscriptions screen showing monthly stack total',
  },
  {
    src: '/landing/ios-search.png',
    alt: 'BingeQueue iOS search screen browsing titles by streaming provider',
  },
] as const;

function PhoneFrame({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative h-fit self-start overflow-hidden rounded-[1.65rem] border border-base-300 bg-neutral shadow-[0_24px_48px_-28px_rgba(0,0,0,0.75)] ${className ?? ''}`}
    >
      <Image
        src={src}
        alt={alt}
        width={828}
        height={1800}
        className="block h-auto w-full"
        sizes="(max-width: 768px) 42vw, 220px"
      />
    </div>
  );
}

export default function IosAppSection() {
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion
    ? { duration: 0 }
    : { duration: duration.slow, ease: easeOut };

  return (
    <section>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20 md:flex-row md:items-center md:gap-14 md:px-12 lg:px-16">
        <motion.div
          className="md:w-[42%]"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={enter}
        >
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
            iOS
          </p>
          <h2 className="mt-2 flex flex-wrap items-baseline gap-x-[0.35em] font-display text-2xl font-semibold tracking-tight text-base-content sm:text-3xl">
            <BrandWordmark className="font-display text-2xl font-semibold tracking-tight sm:text-3xl" />
            <span>on iPhone</span>
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-secondary">
            Track subscriptions and find where to watch from your phone.
            Sign in to sync your subscriptions and watch list across
            devices, or skip the account and keep everything on-device.
          </p>
          <ul className="mt-6 space-y-2.5 text-base text-secondary">
            {bullets.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 inline-flex border border-base-300 px-4 py-2 text-sm font-medium text-base-content">
            Coming soon on iOS
          </p>
        </motion.div>

        <motion.div
          className="relative flex items-start justify-center gap-3 sm:gap-5 md:w-[58%] md:justify-end"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: duration.slow, ease: easeOut, delay: 0.08 }
          }
        >
          <PhoneFrame
            src={screenshots[0].src}
            alt={screenshots[0].alt}
            className="w-[42%] max-w-[13.5rem] shrink-0 md:max-w-[15rem] lg:max-w-[16.5rem]"
          />
          <PhoneFrame
            src={screenshots[1].src}
            alt={screenshots[1].alt}
            className="mt-8 w-[42%] max-w-[13.5rem] shrink-0 md:mt-12 md:max-w-[15rem] lg:max-w-[16.5rem]"
          />
        </motion.div>
      </div>
    </section>
  );
}
