import type { AppProps } from 'next/app'
import Head from 'next/head'
import { WorkerController } from '../components/controllers/WorkerController'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <WorkerController />
      <Component {...pageProps} />
    </>
  )
}