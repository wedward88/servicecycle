import type { Transition } from 'motion/react';

export const easeOut = 'easeOut' as const;

export const duration = {
  fast: 0.2,
  base: 0.35,
  slow: 0.45,
} as const;

export const transitionBase: Transition = {
  duration: duration.base,
  ease: easeOut,
};

export const transitionSlow: Transition = {
  duration: duration.slow,
  ease: easeOut,
};

export const transitionFast: Transition = {
  duration: duration.fast,
  ease: easeOut,
};

/** Hero/marketing entrance: fade + slight rise */
export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

/** App surfaces: opacity only, no per-row choreography */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const menuEnter = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0 },
};
