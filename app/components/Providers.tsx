"use client"

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { SessionProvider } from "next-auth/react"
import { ApolloProvider } from '@apollo/client'
import apolloClient from '@/util/apollo'

const theme = createTheme({
  typography: {
    fontFamily: "monospace"
  }
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <SessionProvider>
          { children }
        </SessionProvider>
      </ApolloProvider>
    </ThemeProvider>
  )
}