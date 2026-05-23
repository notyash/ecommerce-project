import { QueryClient, QueryCache } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onSuccess: (_, query) => {
      console.log(`Query '${query.queryKey}' succeeded:`);
    },
    onError: (error, query) => {
      console.error(`Query '${query.queryKey}' failed:`, error.message);
    },
  }),
});

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
      import('@tanstack/query-core')
        .QueryClient
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient