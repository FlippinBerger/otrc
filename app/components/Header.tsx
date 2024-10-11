import Link from 'next/link'

export default function Header() {
  return (
    <header className='w-full flex justify-between items-center px-8 py-4 top-0'>
      <HeaderItem href='/' title='Home' />
      <HeaderItem href='/about' title='About' />
      <HeaderItem href='/events' title='Events' />
      <HeaderItem href='/join' title='Become a Member' />
    </header>
  )
}

interface Props {
  href: string
  title: string
}

const HeaderItem: React.FC<Props> = ({ href, title }) => {
  return (
    <Link className='hover:underline' href={href}>
      {title}
    </Link>
  )
}
