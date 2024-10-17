import Image from 'next/image'
import Link from 'next/link'
import FAQ from './faq'

export default function Home() {
  return (
    <main className='flex flex-col items-center mt-4'>
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
      <h1 className='hidden sm:block mt-4 text-3xl lg:text-8xl font-bold'>
        Old Town Run Club
      </h1>
      <h1 className='sm:hidden text-4xl mt-4 lg:text-8xl font-bold'>
        FoCo OTRC
      </h1>

      {/*content*/}
      <h2 className='text-3xl mt-4 sm:text-3xl text-center'>
        Come check out the coolest crew around!
      </h2>

      <FAQ />

      <Link className='sm:hidden mt-4' href='/join'>
        <button className='text-2xl border border-green-400 rounded-xl p-2'>
          Join Us
        </button>
      </Link>
    </main>
  )
}
