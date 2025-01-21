import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fetchProviders = async () => {
  const URL = `${process.env.TMDB_URL}watch/providers/tv?api_key=${process.env.TMDB_API_KEY}`;
  const options = {
    method: 'GET',
  };
  const response = await fetch(URL, options);

  if (response.ok) {
    return await response.json();
  } else {
    console.error('Failed to fetch providers:', response.status);
  }
};

async function main() {
  console.log('Fetching providers from TMDB...');
  const providers = await fetchProviders();

  const final = [];

  for (let provider of providers.results) {
    final.push({
      name: provider.provider_name,
      logo: provider.logo_path,
      providerId: provider.provider_id,
    });
  }

  console.log('Inserting providers into the database...');
  for (let provider of final) {
    try {
      await prisma.streamingProvider.upsert({
        where: { providerId: provider.providerId },
        update: {},
        create: {
          providerId: provider.providerId,
          name: provider.name,
          logoUrl: provider.logo,
        },
      });
    } catch (error) {
      console.error(
        `Error inserting provider ${provider.name}:`,
        error
      );
    }
  }
  console.log('DB seeding complete.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
