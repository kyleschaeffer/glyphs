import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { SearchForm } from '../components/SearchForm'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Glyphs</title>
      </Head>
      <h1>
        <Image src="/favicon.svg" width={40} height={40} alt="Glyphs" />
        <span>Glyphs</span>
      </h1>
      <SearchForm />
    </>
  )
}
export default Home
