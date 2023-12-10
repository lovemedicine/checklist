import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Typography } from '@mui/material'
import Link from 'next/link'
import './global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Checklist App',
  description: 'An app for reusing checklists',
}

function Header() {
  const style = {
    backgroundColor: "#eee",
    display: "flex",
    justifyContent: "space-between",
    padding: 10
  }
  
  return (
    <header id="heaer" style={style}>
      <Typography variant="h4" sx={{ '& a': { color: 'black' }}}>
        <Link id="logo" href="/">Checklist App</Link>
      </Typography>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body className={inter.className} style={{ margin: 0 }}>
        <Header />
        <div style={{ padding: 10 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
