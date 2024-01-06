"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
