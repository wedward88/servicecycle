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
- [Motion](https://motion.dev/) for UI animation
- CI/CD via GitHub Actions
- Deployed on a dedicated server running Apache2.
- Streaming provider, TV, and Movie data provided by [TMDB](https://www.themoviedb.org/) (The Movie DB)

## Features

- Registration/Login via OAuth2.0 (Google)
- Branded landing page with product mocks and motion-aware animations
- Streaming subscription management
  - Multi-select popular services with suggested US list prices (editable for grandfathered or different plans)
  - Search all providers when something isn’t in the popular list
  - Channel add-ons and plan-tier duplicates filtered out of search results (Amazon/Apple TV/Roku channels, “with Ads”, Premium variants, etc.)
  - Edit and delete subscriptions
  - Monthly stack total across services
- TV show and movie search
  - Search by title
  - Filter results to All, Movies, or TV
  - Browse popular titles by your current subscriptions (respects the same media filter)
  - Poster cards with watch-list controls
  - Detail modal with overview, availability on your plans, and a full-viewport poster lightbox
  - “Where to watch” lists normalized to standalone services (no channel/tier clutter)
- Watch list
  - Add or remove titles from search results
  - See which titles are available on your current plans
  - Drag to reorder (order is persisted)
  - Remove titles from the list

## Local development

- PostgreSQL via `docker-compose.yml` (port `5433` by default)
- Copy environment variables into `.env` / `.env.local` (`DATABASE_URL`, Google OAuth, `NEXTAUTH_URL`, TMDB keys)
- Run migrations with Prisma, then `npm run dev`

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

Streaming provider, TV, and movie data is provided by [TMDB](https://www.themoviedb.org/). The app includes the required TMDB logo and attribution notice in a Credits section.

## Future Plans

- Add user registration/log in separately from OAuth2.0.
