import Image from 'next/image';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default async function Home() {
  return (
    <div className="hero bg-base-200 min-h-80 rounded-3xl">
      <div className="hero-content text-center w-full">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-5xl font-thin my-10 md:mb-14 lg:mb-16">
            Welcome to{' '}
            <span className="underline decoration-4 decoration-primary font-semibold">
              ServiceCycle.
            </span>
          </h1>
          <div>
            <div className="mb-10 flex flex-col items-center space-y-5">
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
            <div className="flex flex-wrap justify-center gap-10 text-xl font-bold lg:w-[90vw]">
              {[
                {
                  title: 'Track Subscriptions',
                  image: 'subscriptions',
                },
                {
                  title: 'Search for TV or Movies',
                  image: 'search',
                },
                {
                  title: 'View Details',
                  image: 'search-result',
                },
                {
                  title: 'Curate a Watch List',
                  image: 'watch-list',
                },
              ].map(({ title, image }) => (
                <div
                  key={title}
                  className="flex flex-col flex-1 min-w-[70vw] md:min-w-[40vw] lg:min-w-[100px] max-w-[20%]"
                >
                  <h1 className="mb-5">{title}</h1>
                  <Image
                    alt={title}
                    src={`/images/${image}.png`}
                    width={500}
                    height={500}
                    className="shadow-xl rounded-2xl h-auto aspect-auto w-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
