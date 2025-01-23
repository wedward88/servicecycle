import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default async function Home() {
  return (
    <div className="hero bg-base-200 min-h-80 rounded-3xl">
      <div className="hero-content text-center w-full">
        <div className="flex flex-col justify-center w-full">
          <h1 className="text-5xl font-bold mb-10 md:mb-14 lg:mb-16">
            Welcome to{' '}
            <span className="underline decoration-4 decoration-primary">
              ServiceCycle.
            </span>
          </h1>
          <div>
            <div className="mb-6 flex flex-col items-center space-y-5">
              <div className="flex space-x-10">
                <img
                  alt="subscriptions"
                  src="/images/subscriptions.jpg"
                  className="object-cover rounded-2xl w-[200px] md:w-[400px] md:h-[600px]"
                />
                <img
                  alt="subscriptions"
                  src="/images/search1.jpg"
                  className="rounded-2xl shadow-lg hidden lg:block md:w-[400px] md:h-[600px]"
                />
                <img
                  alt="subscriptions"
                  src="/images/search2.jpg"
                  className="rounded-2xl shadow-lg hidden lg:block md:w-[400px] md:h-[600px]"
                />
              </div>
              <div className="mb-6">
                <div className="flex items-start mb-4">
                  <FiCheckCircle className="text-primary h-8 w-8 mr-4 flex-shrink-0" />
                  <p className="text-xl leading-relaxed">
                    Are you tired of juggling subscriptions in order
                    to watch your favorite movies and shows?
                  </p>
                </div>
                <div className="flex items-start mb-4">
                  <FiCheckCircle className="text-primary h-8 w-8 mr-4 flex-shrink-0" />
                  <p className="text-xl leading-relaxed">
                    Are you struggling to keep track of them?
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xl mb-6">
                  Then you've come to the right place. Click 'Get
                  started' below to start tracking your subscriptions
                  today.
                </p>
                <Link
                  className="btn btn-primary"
                  href="/api/auth/signin"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
