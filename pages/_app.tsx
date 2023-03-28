import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Page } from '../components/Page'
import { InputController } from '../controllers/InputController'
import { ThemeController } from '../controllers/ThemeController'
import { WorkerController } from '../controllers/WorkerController'
import '../styles/globals.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <ThemeController />
      <WorkerController />
      <InputController />
      <Page>
        <Component {...pageProps} />
      </Page>
    </>
  )
}
