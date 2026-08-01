import { handleRouteError, jsonOk, requireApiUser } from '@/lib/api/http';
import {
  getCommonStreamingProviders,
  searchStreamingProviders,
} from '@/services/providers';

export async function GET(request: Request) {
  try {
    await requireApiUser();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() ?? '';

    if (!q) {
      const providers = await getCommonStreamingProviders();
      return jsonOk({ providers, source: 'common' });
    }

    const providers = await searchStreamingProviders(q);
    return jsonOk({ providers, source: 'search' });
  } catch (error) {
    return handleRouteError(error);
  }
}
