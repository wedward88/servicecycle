import { signOut } from 'next-auth/react';

type SignOutButtonProps = {
  className?: string;
};

const SignOutButton = ({ className }: SignOutButtonProps) => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <button type="button" onClick={handleSignOut} className={className}>
      Sign out
    </button>
  );
};

export default SignOutButton;
