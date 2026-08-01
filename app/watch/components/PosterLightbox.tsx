'use client';

import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type PosterLightboxProps = {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title: string;
};

const PosterLightbox = ({
  open,
  onClose,
  src,
  alt,
  title,
}: PosterLightboxProps) => {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-neutral/80 backdrop:backdrop-blur-sm open:flex open:items-center open:justify-center"
      aria-label={`${title} poster`}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      {open ? (
        <motion.div
          className="relative max-h-[92vh] max-w-[min(92vw,32rem)] p-3 sm:p-5"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 300, damping: 28 }
          }
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close poster preview"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-base-100/90 text-sm text-base-content shadow-md backdrop-blur-sm transition hover:bg-base-100 sm:right-6 sm:top-6"
          >
            ✕
          </button>
          <Image
            src={src}
            alt={alt}
            width={780}
            height={1170}
            priority
            className="max-h-[92vh] w-auto max-w-full cursor-zoom-out object-contain"
            onClick={onClose}
          />
        </motion.div>
      ) : null}
    </dialog>,
    document.body
  );
};

export default PosterLightbox;
