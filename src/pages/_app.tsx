import Toast from "@/components/inc/toast";
import { ToastProvider } from "@/context/ToastContext";
import Layout from "@/layouts";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Layout>
        <ToastProvider>
          <Head>
            <title>Data Fellows</title>
          </Head>
          <Component {...pageProps} />
          <Toast />
        </ToastProvider>
      </Layout>
    </ThemeProvider>
  );
}
