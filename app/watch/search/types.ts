export type MediaTypeFilter = 'all' | 'movie' | 'tv';

export type SearchResultItemType = {
  id: number;
  media_type: string;
  original_name: string;
  original_title: string;
  overview: string;
  poster_path: string;
  watchListId: number;
};
