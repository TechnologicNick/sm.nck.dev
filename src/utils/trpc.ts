import { createTRPCClient, createTRPCClientProxy } from "@trpc/client";
import { setupTRPC } from "@trpc/next";
import type { AppRouter } from "server/routers/_app";
import superjson from "superjson";

/**
 * If you want to use SSR, you need to use the server's full URL
 * @link https://trpc.io/docs/ssr
 */
const url = "/api/trpc";

export const trpc = setupTRPC<AppRouter>({
  config({ ctx }) {
    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
});
// => { useQuery: ..., useMutation: ...}

const client = createTRPCClient<AppRouter>({
  url,
  transformer: superjson,
});

export const clientProxy = createTRPCClientProxy(client);
