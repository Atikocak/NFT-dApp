import Link from "next/link"
import { useEffect, useState } from "react"

import About from "../components/about"
import Banner from "../components/banner"
import FAQ from "../components/faq"
import Footer from "../components/footer"
import Info from "../components/info"
import Roadmap from "../components/roadmap"
import Socials from "../components/socials"
import Team from "../components/team"

export default function Home() {
  const [clientWindowHeight, setClientWindowHeight] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setClientWindowHeight(window.scrollY)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col w-full h-full min-h-screen overflow-hidden bg-brand-light">
      <Banner />
      <Info />
      <Socials />
      <Roadmap />
      <About />
      <Team />
      <FAQ />
      <Footer />
      <div
        id="scroll-to-top"
        className={`${
          clientWindowHeight > 200 ? "py-1 px-1" : "hidden"
        } fixed bottom-7 right-5 z-50 border-2 border-solid border-black hover:border-blue-600 hover:text-blue-600 rounded-full cursor-pointer animate-bounce-fast transition-all duration-300 shadow shadow-slate-900`}
      >
        <Link href="/">
          <svg
            className="w-8 h-8 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C10.8954 22 10 21.1046 10 20C10 18.8954 10.8954 18 12 18C13.1046 18 14 18.8954 14 20C14 21.1046 13.1046 22 12 22Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 15L12 2M12 2L15 5M12 2L9 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}
