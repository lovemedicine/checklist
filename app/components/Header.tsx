'use client'

import { useSession } from 'next-auth/react'
import { Box, Typography } from '@mui/material'
import Link from 'next/link'

export default function Header() {
  const { data: session } = useSession()
  console.log(session?.user)

  const style = {
    backgroundColor: "#eee",
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    height: 42
  }

  return (
    <header id="header" style={style}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Box>
          <Typography variant="h4" sx={{ '& a': { color: 'black' }}}>
            <Link id="logo" href="/">Checklists</Link>
          </Typography>
        </Box>
        <Box sx={{ p: 1 }}>
          { session?.user &&
            <Typography variant="h5">
              <Link id="logout" href="/api/auth/signout">Logout</Link>
            </Typography>
            }
        </Box>
      </Box>
    </header>
  );
}