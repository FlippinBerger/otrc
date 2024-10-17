import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'

import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: '200',
})

export const metadata: Metadata = {
  title: 'Old Town Run Club',
  description:
    'The best run club (in our opinion) based in Old Town Fort Collins, CO',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${montserrat.className} antialiased`}>
        <Header />
        <div className='px-8 mx-auto'>{children}</div>
      </body>
    </html>
  )
}
