import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UkurKompeten - Kenali kemampuan, asah kompetensi',
  description: 'Platform assessment kompetensi berbasis data untuk profesional Indonesia',
  keywords: ['assessment', 'karir', 'kompetensi', 'skills', 'Indonesia'],
  authors: [{ name: 'UkurKompeten' }],
  openGraph: {
    title: 'UkurKompeten - Kenali kemampuan, asah kompetensi',
    description: 'Platform assessment kompetensi berbasis data untuk profesional Indonesia',
    url: 'https://ukurkompeten.id',
    siteName: 'UkurKompeten',
    locale: 'id_ID',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
