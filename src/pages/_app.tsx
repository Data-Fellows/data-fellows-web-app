import Toast from "@/components/inc/toast";
import PostProblemModal from "@/components/modals/PostProblemModal";
import {
  PostProblemModalProvider,
  usePostProblemModal,
} from "@/context/PostProblemModalContext";
import { ToastProvider } from "@/context/ToastContext";
import Layout from "@/layouts";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

function AppWithModal({ Component, pageProps, router }: any) {
  const { isOpen, closeModal, templateData } = usePostProblemModal();
  const queryClient = useQueryClient();

  const handleModalSuccess = () => {
    // Invalidate relevant React Query caches
    queryClient.invalidateQueries({ queryKey: ["problems"] });
    queryClient.invalidateQueries({ queryKey: ["profile"] });

    // Dispatch custom event for non-React Query hooks
    window.dispatchEvent(new CustomEvent("problemPosted"));
  };

  return (
    <>
      <Component {...pageProps} />
      {router.pathname.startsWith("/dashboard") && (
        <PostProblemModal
          isOpen={isOpen}
          onClose={closeModal}
          onSuccess={handleModalSuccess}
          templateData={templateData}
        />
      )}
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
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
            <PostProblemModalProvider>
              <Head>
                <title>Data Fellows</title>
              </Head>
              <AppWithModal
                Component={Component}
                pageProps={pageProps}
                router={router}
              />
              <Toast />
            </PostProblemModalProvider>
          </ToastProvider>
        </QueryClientProvider>
      </Layout>
    </ThemeProvider>
  );
}
