import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head';
import { HeaderProvider } from '../_contexts/HeaderContext';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    // <HeaderProvider>
    <body className={inter.className}>{children}</body>
    // </HeaderProvider>
  )
}
