import { RiInstagramLine } from '@remixicon/react'
import Image from 'next/image'

export default function Footer() {
  const imageSize = 36
  return (
    <footer className='flex my-4 items-center gap-2 text-white'>
      <a href='https://www.instagram.com/oldtownrunclubfc/' target='_blank'>
        <RiInstagramLine size={imageSize} />
      </a>
      <a href='https://www.strava.com/clubs/1286057' target='_blank'>
        <Image
          src='/images/strava.svg'
          alt='strava'
          height={imageSize - 4}
          width={imageSize - 4}
        />
      </a>
    </footer>
  )
}
