'use client';

import { signIn } from 'next-auth/react';

type SignInButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

const SignInButton = ({
  className,
  children = 'Get started',
}: SignInButtonProps) => {
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        signIn('google', { callbackUrl: '/subscriptions' })
      }
    >
      {children}
    </button>
  );
};

export default SignInButton;
