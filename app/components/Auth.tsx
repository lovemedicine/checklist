"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import { isAuthEnabled } from "@/util/auth";

export default function Auth() {
  const { data: session } = useSession();

  if (!isAuthEnabled()) return null;

  const buttonText = session?.user ? "Logout" : "Sign in";
  const endpoint = session?.user ? "signout" : "signin";

  return (
    <Box sx={{ float: "right" }}>
      <Box sx={{ p: 1 }}>
        <Typography variant="h5">
          <Link id="logout" href={`/api/auth/${endpoint}`}>
            <Button variant="outlined" size="large">
              {buttonText}
            </Button>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
