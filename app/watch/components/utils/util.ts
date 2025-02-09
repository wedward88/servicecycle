import { SearchResultItemType } from '../../search/types';
import {
  StreamingProviderType,
  WatchListItemType,
} from '../../watch-list/types';
import { ProviderDictionary } from '../types';

export function mapSearchResultToWatchListItem(
  item: SearchResultItemType,
  watchProviders: ProviderDictionary
): WatchListItemType {
  return {
    id: item.id,
    mediaId: item.id,
    mediaType: item.media_type,
    originalTitle: item.original_title,
    originalName: item.original_name,
    posterPath: item.poster_path,
    overview: item.overview,
    streamingProviders: Object.values(watchProviders).map(
      (provider) => ({
        providerId: provider.id,
        name: provider.provider_name,
        logoUrl: provider.logo_path,
      })
    ),
  };
}
