export type WatchListItemType = {
  id: number;
  mediaId: number;
  mediaType: string;
  originalTitle: string | null;
  originalName: string | null;
  posterPath: string;
  overview: string;
  streamingProviders?: {
    id: number;
    name: string;
    logoUrl: string;
    providerId: number;
  }[];
};
