import Image from 'next/image';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default async function Home() {
  return (
    <div className="hero bg-base-200 min-h-80 rounded-3xl">
      <div className="hero-content text-center w-full">
        <div className="flex flex-col justify-center w-full">
          <h1 className="text-5xl font-thin mb-10 md:mb-14 lg:mb-16">
            Welcome to{' '}
            <span className="underline decoration-4 decoration-primary">
              ServiceCycle.
            </span>
          </h1>
          <div>
            <div className="mb-6 flex flex-col items-center space-y-5">
              <div className="flex space-x-10">
                <Image
                  alt="subscriptions"
                  src="/images/subscriptions.jpg"
                  width={500}
                  height={500}
                  className="shadow-xl object-fill rounded-2xl h-auto aspect-auto md:w-[20vw]"
                />
                <Image
                  alt="subscriptions"
                  src="/images/search1.jpg"
                  width={500}
                  height={500}
                  className="rounded-2xl shadow-xl h-auto w-[30vw] hidden lg:block"
                />
                <Image
                  alt="subscriptions"
                  src="/images/search2.jpg"
                  width={500}
                  height={500}
                  className="rounded-2xl shadow-xl h-auto aspect-auto w-[20vw] hidden xl:block"
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
                  Then you&apos;ve come to the right place. Click
                  &apos;Get started&apos; below to start tracking your
                  subscriptions today.
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
