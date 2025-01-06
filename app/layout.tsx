import type { Metadata } from 'next'
import './globals.css'
// import Header from './components/Header'

import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: '200',
})

export const metadata: Metadata = {
  title: 'Old Town Run Club',
  description:
    'The best and most chill run club (in our opinion) in Fort Collins, Colorado. Meets at Tap & Handle in Old Town.',
  keywords: [
    'Fort Collins',
    'Run Club',
    'Old Town',
    'Tap and Handle',
    'Tap & Handle',
  ],
  authors: [{ name: 'Chris Berger', url: 'https://flippinberger.com' }],
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow',
  },
  verification: { google: 'wQ5AtplJOoaHaRgOezrHumvuSY1YSaMKCXtNWxEqu6w' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${montserrat.className} antialiased`}>
        {/*<Header />*/}
        <div className='px-4 mx-auto mt-16'>{children}</div>
      </body>
    </html>
  )
}
