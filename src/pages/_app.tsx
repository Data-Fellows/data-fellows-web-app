import Toast from "@/components/inc/toast";
import { ToastProvider } from "@/context/ToastContext";
import Layout from "@/layouts";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: true,
            staleTime: 5 * 60 * 1000,
            gcTime: 20 * 60 * 1000,
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
        </QueryClientProvider>
      </Layout>
    </ThemeProvider>
  );
}
