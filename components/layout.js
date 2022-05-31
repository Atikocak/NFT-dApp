import Head from "next/head"
import { config } from "../dapp.config"
import Navbar from "./navbar"

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
