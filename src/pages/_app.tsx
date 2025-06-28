import Toast from "@/components/inc/toast";
import { ToastProvider } from "@/context/ToastContext";
import Layout from "@/layouts";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Prevent refetching on window focus by default
            refetchOnWindowFocus: false,
            // Don't refetch on mount if data exists
            refetchOnMount: false,
            // Only refetch on network reconnect
            refetchOnReconnect: true,
            // Increase stale time globally
            staleTime: 5 * 60 * 1000, // 5 minutes
            // Increase garbage collection time
            gcTime: 20 * 60 * 1000, // 20 minutes
            // Retry failed requests
            retry: 2,
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      })
  );

  return (
    <ThemeProvider>
      <Layout>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <Head>
              <title>Data Fellows</title>
            </Head>
            <Component {...pageProps} />
            <Toast />
          </ToastProvider>
          {/* React Query DevTools - only shows in development */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Layout>
    </ThemeProvider>
  );
}
