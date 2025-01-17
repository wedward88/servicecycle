import { signOut } from 'next-auth/react';

const SignOutLink = () => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' }); // This ensures the user is redirected to '/' after sign out
  };

  return (
    <button onClick={handleSignOut} className="btn">
      Sign Out
    </button>
  );
};

export default SignOutLink;
