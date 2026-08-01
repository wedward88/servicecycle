/** TMDB watch-provider IDs for commonly used US streaming services. */
export const COMMON_STREAMING_PROVIDER_IDS = [
  8, // Netflix
  337, // Disney Plus
  15, // Hulu
  1899, // Max (HBO Max)
  9, // Amazon Prime Video
  350, // Apple TV
  386, // Peacock Premium
  531, // Paramount Plus
  283, // Crunchyroll
  43, // Starz
] as const;

/** Short labels for chip UI (TMDB names can be long). */
export const COMMON_PROVIDER_LABELS: Record<number, string> = {
  8: 'Netflix',
  337: 'Disney+',
  15: 'Hulu',
  1899: 'Max',
  9: 'Prime Video',
  350: 'Apple TV+',
  386: 'Peacock',
  531: 'Paramount+',
  283: 'Crunchyroll',
  43: 'Starz',
};

/**
 * Suggested US monthly list prices for a common plan tier.
 * Not live — prices change often and vary by plan/region/promo.
 * Users can edit for grandfathered or different tiers.
 *
 * Approx as of mid-2026; prefer with-ads / standard consumer tiers.
 */
export const SUGGESTED_PROVIDER_COSTS: Record<number, string> = {
  8: '19.99', // Netflix Standard
  337: '11.99', // Disney+ with ads
  15: '11.99', // Hulu with ads
  1899: '18.49', // Max Standard
  9: '14.99', // Amazon Prime (includes Prime Video)
  350: '12.99', // Apple TV+
  386: '10.99', // Peacock Premium
  531: '8.99', // Paramount+ Essential
  283: '11.99', // Crunchyroll Fan
  43: '11.99', // Starz
};

export function getSuggestedCost(providerId: number): string {
  return SUGGESTED_PROVIDER_COSTS[providerId] ?? '';
}
