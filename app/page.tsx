import Image from 'next/image'
import FAQ from './faq'
import Footer from './footer'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='flex flex-col items-center sm:pt-4'>
      {/*images*/}
      <Image
        width={600}
        height={0}
        src='/images/shirt_day.jpg'
        alt='run club shirt day'
        style={{ width: '80%', height: 'auto' }}
        objectFit='cover'
        className='object-cover sm:hidden rounded'
      />
      <Image
        width={600}
        height={400}
        src='/images/shirt_day.jpg'
        alt='run club shirt day'
        // style={{ width: 'auto', height: '40%' }}
        objectFit='cover'
        className='object-cover sm:block hidden rounded'
      />

      {/*titles*/}
      <h1 className='hidden sm:block mt-4 lg:text-8xl font-bold'>
        Old Town Run Club
      </h1>

      <h1 className='sm:hidden mt-4 font-bold'>FoCo OTRC</h1>
      <h2>6pm Thursdays</h2>
      <h2>
        <span className='italic font-bold'>
          <a href='https://tapandhandle.com/' target='_blank'>
            Tap and Handle
          </a>
        </span>
      </h2>

      <h2 className='hidden sm:block text-2xl'>Fort Collins, CO</h2>

      {/*content*/}
      <h2 className='text-3xl mt-4 sm:text-3xl text-center'>
        A social club that likes to run!
      </h2>
      <div className='hidden sm:block'>
        <FAQ />
      </div>
      <Link className='sm:hidden mt-4 text-2xl' href='/faq'>
        <h1>FAQ</h1>
      </Link>

      {/*
      <Link className='sm:hidden mt-4' href='/join'>
        <button className='text-2xl border border-green-400 rounded-xl p-2'>
          Join Us
        </button>
      </Link>
      */}

      <Footer />
    </main>
  )
}
