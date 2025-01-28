'use server';

export async function fetchWatchProviders(type: string, id: number) {
  const TMDB_ENDPOINT = `${type}/${id}/watch/providers`;
  const URL = `${process.env.TMDB_URL}${TMDB_ENDPOINT}?api_key=${process.env.TMDB_API_KEY}`;
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const media = await response.json();

  return media.results.US || [];
}

export async function fetchTMDBResults(query: string) {
  const TMDB_ENDPOINT = 'search/multi?query=';
  const URL = `${process.env.TMDB_URL}${TMDB_ENDPOINT}${query}&api_key=${process.env.TMDB_API_KEY}`;
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const results = await response.json();

  const final = results.results;

  return final.filter(
    (item: {
      media_type: string;
      poster_path: string | null;
      vote_average: number;
      original_language: string;
    }) =>
      item.media_type !== 'person' &&
      item.poster_path !== null &&
      item.vote_average !== 0 &&
      item.original_language === 'en'
  );
}
