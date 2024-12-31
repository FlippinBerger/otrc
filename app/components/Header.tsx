'use client'

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  useClose,
} from '@headlessui/react'
import { RiMenuLine } from '@remixicon/react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className='fixed w-full px-8 py-4 top-0 sm:h-16 bg-[#1A1110] sm:border-b border-zinc-700'>
      <div className='hidden sm:flex justify-between items-center'>
        <HeaderItem href='/' title='Home' />
        <HeaderItem href='/events' title='Events' />
        {/*<HeaderItem href='/join' title='Become a Member' />*/}
      </div>
      <Popover className='sm:hidden fixed right-8 top-2'>
        <PopoverButton className='bg-black text-rose-300 rounded-full p-1'>
          <RiMenuLine size='36' />
        </PopoverButton>
        <PopoverPanel
          anchor='bottom'
          className='flex flex-col p-2 bg-black border rounded border-rose-300'
        >
          <MobileHeaderItem href='/' title='Home' />
          <MobileHeaderItem href='/events' title='Events' />
          {/*<MobileHeaderItem href='/join' title='Become a Member' />*/}
          <MobileHeaderItem href='/faq' title='FAQ' />
        </PopoverPanel>
      </Popover>
    </header>
  )
}

interface Props {
  href: string
  title: string
  onClick?: () => void
}

const HeaderItem: React.FC<Props> = ({ href, title }) => {
  return (
    <Link
      className='hover:underline text-orange-300 font-bold text-2xl'
      href={href}
    >
      {title}
    </Link>
  )
}

const MobileHeaderItem: React.FC<Props> = ({ href, title }) => {
  const close = useClose()
  return (
    <Link
      className='text-rose-300 text-2xl py-2 hover:underline'
      href={href}
      onClick={close}
    >
      {title}
    </Link>
  )
}
