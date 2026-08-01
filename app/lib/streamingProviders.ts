import { COMMON_STREAMING_PROVIDER_IDS } from '@/app/lib/commonProviders';

/**
 * TMDB lists the same catalog many times as platform channel add-ons
 * (e.g. "Paramount+ Amazon Channel") and as plan tiers
 * (e.g. "Paramount Plus Premium", "Netflix basic with Ads").
 * Normalize UI lists down to standalone services.
 */

const HOSTED_CHANNEL_PATTERNS = [
  /\bamazon\s+channel\b/i,
  /\bapple\s*tv\s+channel\b/i,
  /\broku\s+premium\s+channel\b/i,
  /\bsamsung(?:\s+tv)?\s+channel\b/i,
];

/** Real services whose names overlap the channel-addon patterns. */
const STANDALONE_EXCEPTIONS = new Set(['the roku channel', 'channel 4']);

/** Plan / monetization suffixes that are variants of a base service. */
const TIER_SUFFIX_PATTERNS = [
  /\s+premium\s+plus$/i,
  /\s+(basic\s+)?with\s+ads$/i,
  /\s+with\s+showtime$/i,
  /\s+premium$/i,
];

const COMMON_PROVIDER_ID_SET = new Set<number>(
  COMMON_STREAMING_PROVIDER_IDS
);

export type ProviderLike = {
  name: string;
  providerId?: number;
};

export function isHostedChannelAddon(name: string): boolean {
  const normalized = normalizeWhitespace(name);
  if (!normalized || STANDALONE_EXCEPTIONS.has(normalized)) {
    return false;
  }
  return HOSTED_CHANNEL_PATTERNS.some((pattern) =>
    pattern.test(normalized)
  );
}

export function isPlanTierVariant(name: string): boolean {
  const normalized = normalizeWhitespace(name);
  if (!normalized) return false;
  return TIER_SUFFIX_PATTERNS.some((pattern) => pattern.test(normalized));
}

/** Family key used to collapse Paramount Plus / Premium / with Ads, etc. */
export function providerFamilyKey(name: string): string {
  let normalized = normalizeWhitespace(name).replace(/\+/g, ' plus ');
  normalized = normalizeWhitespace(normalized);

  let previous = '';
  while (previous !== normalized) {
    previous = normalized;
    for (const pattern of TIER_SUFFIX_PATTERNS) {
      normalized = normalized.replace(pattern, '');
    }
    normalized = normalizeWhitespace(normalized);
  }

  return normalized;
}

export function filterStandaloneProviders<T extends ProviderLike>(
  providers: T[]
): T[] {
  const withoutChannels = providers.filter(
    (provider) => !isHostedChannelAddon(provider.name)
  );

  const groups = new Map<string, T[]>();
  const order: string[] = [];

  for (const provider of withoutChannels) {
    const key = providerFamilyKey(provider.name);
    if (!key) continue;

    const existing = groups.get(key);
    if (existing) {
      existing.push(provider);
    } else {
      groups.set(key, [provider]);
      order.push(key);
    }
  }

  return order.map((key) => pickPreferredProvider(groups.get(key)!));
}

function pickPreferredProvider<T extends ProviderLike>(group: T[]): T {
  return [...group].sort((a, b) => {
    const aCommon = hasCommonProviderId(a) ? 1 : 0;
    const bCommon = hasCommonProviderId(b) ? 1 : 0;
    if (aCommon !== bCommon) return bCommon - aCommon;

    const aTier = isPlanTierVariant(a.name) ? 1 : 0;
    const bTier = isPlanTierVariant(b.name) ? 1 : 0;
    if (aTier !== bTier) return aTier - bTier;

    return a.name.length - b.name.length;
  })[0];
}

function hasCommonProviderId(provider: ProviderLike): boolean {
  return (
    provider.providerId != null &&
    COMMON_PROVIDER_ID_SET.has(provider.providerId)
  );
}

function normalizeWhitespace(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}
