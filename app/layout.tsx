import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'OnlyUsedTesla.co.uk — Tesla Cash Offers',
  description:
    'Get a cash offer for your Tesla in the UK. We invite verified buyers from our network. Free for sellers.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
