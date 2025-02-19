# ServiceCycle

[servicecycle.wedward.com](https://servicecycle.wedward.com)

A fullstack project to keep track of your streaming subscriptions, and search for TV shows and movies.

## Technology

- [Next.js](https://nextjs.org/)
- [Zustand](https://github.com/pmndrs/zustand) State Management
- [React](https://react.dev/)
- [Prisma](https://www.prisma.io/) ORM
- TypeScript
- PostgreSQL
- OAuth2.0
- CI/CD via GitHub Actions
- Deployed on a dedicated server running Apache2.
- Streaming provider, TV, and Movie data provided by [TMDB](https://www.themoviedb.org/) (The Movie DB)

## Features

- Registration/Login via OAuth2.0 (Google)
- Streaming Subscription Management
  - Add subscriptions (select from a pre-fetched list of providers, include cost)
  - Edit subscriptions
  - Delete subscriptions
  - Subscriptions total monthly cost
- TV Show and Movie Search
  - See where you can watch a particular show or movie
  - Confirm if you're subscribed to a streaming provider that has the show or movie you're interested in watching
- Watch List
  - Add TV shows or movies to a watch list
  - See which shows or movies you have an active subscription to view
  - Delete from watch list

## Future Plans

- Add user registration/log in separately from OAuth2.0.
- Add drag to reorder functionality/animation to watch list
