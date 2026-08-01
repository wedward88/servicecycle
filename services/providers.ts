import { COMMON_STREAMING_PROVIDER_IDS } from '@/app/lib/commonProviders';
import { filterStandaloneProviders } from '@/app/lib/streamingProviders';
import prisma from '@/prisma/client';

export async function searchStreamingProviders(query: string) {
  if (!query.trim()) return [];

  const providers = await prisma.streamingProvider.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    // Over-fetch so channel add-ons can be stripped without starving results.
    take: 40,
  });

  return filterStandaloneProviders(providers).slice(0, 10);
}

export async function getCommonStreamingProviders() {
  const providers = await prisma.streamingProvider.findMany({
    where: {
      providerId: {
        in: [...COMMON_STREAMING_PROVIDER_IDS],
      },
    },
  });

  const order = new Map<number, number>(
    COMMON_STREAMING_PROVIDER_IDS.map((id, index) => [id, index])
  );

  return providers.sort(
    (a, b) =>
      (order.get(a.providerId) ?? 99) - (order.get(b.providerId) ?? 99)
  );
}

export async function findStreamingProvidersByTmdbIds(
  providerIds: number[]
) {
  if (providerIds.length === 0) return [];

  return prisma.streamingProvider.findMany({
    where: {
      providerId: { in: providerIds },
    },
  });
}
