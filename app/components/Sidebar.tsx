import Link from 'next/link'

export default function Sidebar() {
  return (
    <nav className='w-1/12 flex ml-4 mt-4'>
      <ul className='flex flex-col gap-3 w-full'>
        <SideBarItem href='/' title='Home' />
        <SideBarItem href='/about' title='About' />
        <SideBarItem href='/events' title='Events' />
      </ul>
    </nav>
  )
}

interface Props {
  href: string
  title: string
}

const SideBarItem: React.FC<Props> = ({ href, title }) => {
  return (
    <li className='hover:underline'>
      <Link href={href}>{title}</Link>
    </li>
  )
}
