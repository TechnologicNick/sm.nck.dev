import { setupTRPC } from "@trpc/next";
import type { AppRouter } from "server/routers/_app";
import superjson from "superjson";

export const trpc = setupTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.APP_URL
      ? `https://${process.env.APP_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

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
  ssr: true,
});
// => { useQuery: ..., useMutation: ...}
