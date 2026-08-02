import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy · BingeQueue',
  description: 'How BingeQueue collects, uses, and stores your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 md:px-12 md:py-16">
      <p className="text-sm text-secondary">
        <Link href="/" className="text-primary hover:underline">
          ← Back to BingeQueue
        </Link>
      </p>

      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-base-content sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-secondary">Last updated: August 2, 2026</p>

      <div className="prose-brand mt-10 space-y-8 text-base leading-relaxed text-secondary">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-base-content">
            Overview
          </h2>
          <p>
            BingeQueue (“we”, “our”, or “the app”) helps you track streaming
            subscriptions and save titles you want to watch. This policy
            explains what information we collect and how we use it for the
            BingeQueue website and iOS app.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-base-content">
            Information we collect
          </h2>
          <p>
            <span className="font-medium text-base-content">
              If you sign in with Google:
            </span>{' '}
            we receive your Google account email address, name, and profile
            image (if available). We use this to create and maintain your
            BingeQueue account.
          </p>
          <p>
            <span className="font-medium text-base-content">
              Account content you provide:
            </span>{' '}
            streaming subscriptions (including costs you enter), watch list
            titles, and related preferences. This is stored on our servers so
            it can sync across devices when you are signed in.
          </p>
          <p>
            <span className="font-medium text-base-content">
              If you continue without an account (guest mode on iOS):
            </span>{' '}
            subscriptions and watch list data stay on your device. That guest
            data is not uploaded to our servers and is not mixed with a signed-in
            account’s library.
          </p>
          <p>
            <span className="font-medium text-base-content">
              Movie and TV information:
            </span>{' '}
            title details, posters, and provider availability come from the
            TMDB API. BingeQueue uses the TMDB API but is not endorsed or
            certified by TMDB.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-base-content">
            How we use information
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>To provide sign-in and keep your account secure</li>
            <li>
              To store and show your subscriptions, monthly total, and watch
              list
            </li>
            <li>
              To show where titles are available and how they relate to your
              plans
            </li>
            <li>To improve and maintain the service</li>
          </ul>
          <p>We do not sell your personal information.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-base-content">
            Third parties
          </h2>
          <p>
            <span className="font-medium text-base-content">Google:</span> used
            for Sign in with Google. Google’s handling of your data is covered
            by Google’s privacy policy.
          </p>
          <p>
            <span className="font-medium text-base-content">TMDB:</span> used to
            fetch publicly available movie and TV metadata. Requests to TMDB are
            made by our servers as needed to power search and title details.
          </p>
          <p>
            We may use hosting and infrastructure providers to run the website
            and API. They process data only to operate the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-base-content">
            Data retention and deletion
          </h2>
          <p>
            Account data is kept while your account exists. You can sign out at
            any time. To request deletion of your account and associated server
            data, contact us using the details below. Guest-mode data can be
            removed by deleting the app or clearing the app’s data on your
            device.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-base-content">
            Children’s privacy
          </h2>
          <p>
            BingeQueue is not directed at children under 13, and we do not
            knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-base-content">
            Changes
          </h2>
          <p>
            We may update this policy from time to time. The “Last updated”
            date at the top will change when we do. Continued use of BingeQueue
            after an update means you accept the revised policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-base-content">
            Contact
          </h2>
          <p>
            For privacy questions or account deletion requests, contact the
            developer email listed on the BingeQueue App Store page, or reach
            out through the support contact associated with your BingeQueue /
            Apple Developer account.
          </p>
        </section>
      </div>
    </main>
  );
}
