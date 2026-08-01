import {
  filterStandaloneProviders,
  isHostedChannelAddon,
  isPlanTierVariant,
  providerFamilyKey,
} from '@/app/lib/streamingProviders';

describe('isHostedChannelAddon', () => {
  it.each([
    'Paramount+ Amazon Channel',
    'Paramount Plus Apple TV Channel',
    'Paramount+ Roku Premium Channel',
    'AMC+ Amazon Channel',
    'Britbox Apple TV Channel',
    'Starz Roku Premium Channel',
    'ALLBLK Amazon channel',
    'ARD Plus Apple TV channel',
  ])('flags hosted channel addon: %s', (name) => {
    expect(isHostedChannelAddon(name)).toBe(true);
  });

  it.each([
    'Paramount Plus',
    'Paramount Plus Premium',
    'Netflix',
    'Amazon Prime Video',
    'Apple TV+',
    'fuboTV',
    'Spectrum On Demand',
    'The Roku Channel',
    'Channel 4',
  ])('keeps standalone service: %s', (name) => {
    expect(isHostedChannelAddon(name)).toBe(false);
  });
});

describe('isPlanTierVariant', () => {
  it.each([
    'Paramount Plus Premium',
    'Paramount Plus Basic with Ads',
    'Paramount+ with Showtime',
    'Netflix basic with Ads',
    'Amazon Prime Video with Ads',
    'Peacock Premium Plus',
    'Peacock Premium',
    'YouTube Premium',
  ])('flags plan tier suffix: %s', (name) => {
    expect(isPlanTierVariant(name)).toBe(true);
  });

  it.each(['Paramount Plus', 'Netflix', 'Amazon Prime Video'])(
    'does not flag base service as tier: %s',
    (name) => {
      expect(isPlanTierVariant(name)).toBe(false);
    }
  );
});

describe('providerFamilyKey', () => {
  it('groups Paramount tiers under one family', () => {
    expect(providerFamilyKey('Paramount Plus')).toBe('paramount plus');
    expect(providerFamilyKey('Paramount Plus Premium')).toBe(
      'paramount plus'
    );
    expect(providerFamilyKey('Paramount Plus Basic with Ads')).toBe(
      'paramount plus'
    );
    expect(providerFamilyKey('Paramount+ with Showtime')).toBe(
      'paramount plus'
    );
  });

  it('groups Peacock Premium Plus with Peacock Premium', () => {
    expect(providerFamilyKey('Peacock Premium')).toBe('peacock');
    expect(providerFamilyKey('Peacock Premium Plus')).toBe('peacock');
  });
});

describe('filterStandaloneProviders', () => {
  it('removes hosted channel addons and keeps standalone services', () => {
    const providers = [
      { name: 'Paramount Plus', providerId: 531 },
      { name: 'Paramount Plus Apple TV Channel', providerId: 1853 },
      { name: 'Paramount+ Amazon Channel', providerId: 582 },
      { name: 'Paramount+ Roku Premium Channel', providerId: 633 },
      { name: 'fuboTV', providerId: 257 },
      { name: 'Spectrum On Demand', providerId: 486 },
      { name: 'The Roku Channel', providerId: 207 },
    ];

    expect(filterStandaloneProviders(providers)).toEqual([
      { name: 'Paramount Plus', providerId: 531 },
      { name: 'fuboTV', providerId: 257 },
      { name: 'Spectrum On Demand', providerId: 486 },
      { name: 'The Roku Channel', providerId: 207 },
    ]);
  });

  it('collapses plan tier variants to the main service', () => {
    const providers = [
      { name: 'Paramount Plus Premium', providerId: 2303 },
      { name: 'Paramount Plus', providerId: 531 },
      { name: 'Paramount Plus Basic with Ads', providerId: 2304 },
      { name: 'Paramount+ with Showtime', providerId: 1770 },
      { name: 'Netflix basic with Ads', providerId: 1796 },
      { name: 'Netflix', providerId: 8 },
      { name: 'Amazon Prime Video with Ads', providerId: 2100 },
      { name: 'Amazon Prime Video', providerId: 9 },
      { name: 'Peacock Premium Plus', providerId: 387 },
      { name: 'Peacock Premium', providerId: 386 },
    ];

    expect(filterStandaloneProviders(providers)).toEqual([
      { name: 'Paramount Plus', providerId: 531 },
      { name: 'Netflix', providerId: 8 },
      { name: 'Amazon Prime Video', providerId: 9 },
      { name: 'Peacock Premium', providerId: 386 },
    ]);
  });

  it('keeps a tier-named service when it is the only family member', () => {
    expect(
      filterStandaloneProviders([
        { name: 'YouTube Premium', providerId: 188 },
        { name: 'Peacock Premium', providerId: 386 },
      ])
    ).toEqual([
      { name: 'YouTube Premium', providerId: 188 },
      { name: 'Peacock Premium', providerId: 386 },
    ]);
  });
});
