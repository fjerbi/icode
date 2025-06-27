"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { useState } from "react";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./routers/_app";

// Create the tRPC context for React Query integration
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

// Initialize the tRPC client
export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: superjson,
      url: getUrl(),
    }),
  ],
});

// Function to get the base URL for the tRPC API
function getUrl() {
  const base = typeof window === "undefined" ? process.env.NEXT_PUBLIC_APP_URL : "";
  return `${base}/api/trpc`;
}

// Singleton QueryClient for browser
let browserQueryClient: QueryClient;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() => trpc); // Use the exported trpc client

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}