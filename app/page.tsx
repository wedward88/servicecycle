import Link from 'next/link';

export default async function Home() {
  return (
    <div className="hero bg-base-200 min-h-80 rounded-3xl">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            Welcome to ServiceCycle.
          </h1>
          <p className="py-6">
            Are you tired of signing up for loads of streaming
            subscriptions in order to watch your favorite movies and
            shows?
            <br /> Are you struggling to keep track of them?
            <br /> <br /> Then you've come to the right place. Click
            'Get started' below to start tracking your subscriptions
            today.
          </p>
          <Link className="btn btn-primary" href="/api/auth/signin">
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
