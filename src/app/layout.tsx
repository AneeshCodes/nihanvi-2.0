import type { Metadata } from 'next'
import { Inter, Lobster_Two } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const lobsterTwo = Lobster_Two({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lobster-two',
})

export const metadata: Metadata = {
  title: 'Nihanvi School of Dance',
  description: 'Student & Teacher Portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${lobsterTwo.variable}`}>
        {children}
      </body>
    </html>
  )
}
