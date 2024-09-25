"use client";

import { useUserContext } from "@/app/user-context";
import Link from "next/link";
import { Box, Button, Typography, Container } from "@mui/material";

export default function Home() {
  const user = useUserContext();
  const message = user.isAuthenticated
    ? `Hi ${user.name}, you are granted with ${rolesStr(user)}.`
    : "Welcome to our platform. Please log in to continue.";

  function rolesStr(user) {
    if (!user?.roles?.length) {
      return "[]";
    }
    return `["${user.roles.join('", "')}"]`;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Main Content */}
      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 4 }}>
          Welcome to the Banking Platform
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 6 }}>
          {message}
        </Typography>
        
      </Container>
    </Box>
  );
}
