import { Inter } from 'next/font/google'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

export default function Home() {
  return (
   <main>
      <Navbar/>
      <Footer/>
   </main>
  )
}
