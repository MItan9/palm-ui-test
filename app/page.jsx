"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Paper, Button, TextField, List, ListItem, ListItemText } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import { useUserContext } from "@/app/user-context";
import Link from "next/link"; // Import Link for navigation
import axios from "axios";

// Function to get CSRF token from cookies
const getCsrfToken = () => {
  const cookieName = 'XSRF-TOKEN=';
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName)) {
      return cookie.substring(cookieName.length);
    }
  }
  return null;
};

export default function Dashboard() {
  const user = useUserContext();
  const [balance, setBalance] = useState("N/A");
  const [mfaStatus, setMfaStatus] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [mfaSecret, setMfaSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [authCode, setAuthCode] = useState(""); // Field to store the code entered by the user
  const [submitedCodeStatus, setSubmitedCodeStatus] = useState("");
  const [showSecretKey, setShowSecretKey] = useState(false); // New state to track secret key visibility

  useEffect(() => {
    if (user.isAuthenticated) {
      setBalance("$10,000"); // Mock balance data for demonstration
      handleLinkTotp();
    }
  }, [user]);

  const handleLinkTotp = async () => {
    setLoading(true);
    setStatusMessage(null);
  
    try {
      const csrfToken = getCsrfToken();
      if (!csrfToken) {
        setStatusMessage("CSRF token not found.");
        setLoading(false);
        return;
      }
  
      const response = await axios.get("auth/oauth2/generate-qr-code", {
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken,
        },
        withCredentials: true,
      });
  
      if (response.status === 200) {
        setMfaStatus(200);
        setQrCode(response.data.qrCode);
        setMfaSecret(response.data.mfaSecret);
      }
    } catch (error) {
      if (error.response && error.response.status === 404 && error.response.data.error === "E016") {
        setMfaStatus(404); // MFA already enabled
      } else {
        setStatusMessage("Error occurred while linking TOTP token and generating QR code.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to send the code entered by the user to the server
  const handleSubmitCode = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const csrfToken = getCsrfToken();
      if (!csrfToken) {
        setStatusMessage("CSRF token not found.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "/bff/auth/link-totp",
        { code: authCode },  // Here we pass the authCode entered by the user
        {
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken,
          },
          withCredentials: true,
        }
      );
      setSubmitedCodeStatus(response.status);
      if (response.status === 200) {
        setStatusMessage("MFA successfully linked!");
      } else {
        setStatusMessage("Failed to link MFA. Please try again.");
      }
    } catch (error) {
      setStatusMessage("Error occurred while linking MFA: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user.isAuthenticated) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Container
          maxWidth="md"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: 4 }}>
            Welcome to the Banking Platform
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 6 }}>
            Please log in to access your account and dashboard.
          </Typography>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (mfaStatus === 404 || submitedCodeStatus === 200) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex" }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          {/* Sidebar */}
          <Box
            sx={{
              width: 256,
              backgroundColor: "#121a2a", 
              color: "white",
              padding: 3,
              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 4, fontWeight: "bold" }}>
              Menu
            </Typography>
            <List>
              <ListItem button component={Link} href="/transaction-history" sx={{ color: "white", '&:hover': { color: "gray.300" } }}>
                <ListItemText primary="Transaction History" />
              </ListItem>
              <ListItem button component={Link} href="/transfer-money" sx={{ color: "white", '&:hover': { color: "gray.300" } }}>
                <ListItemText primary="Transfer Money" />
              </ListItem>
              <ListItem button component={Link} href="/profile" sx={{ color: "white", '&:hover': { color: "gray.300" } }}>
                <ListItemText primary="Profile" />
              </ListItem>
            </List>
          </Box>

          {/* Main content */}
          <Box sx={{ flex: 1, padding: 4, position: "relative" }}>
            <Typography variant="h3" sx={{ marginBottom: 4, fontWeight: "bold" }}>
              Dashboard
            </Typography>

            {/* Balance Card */}
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                maxWidth: 400,
                backgroundColor: "white",
                borderRadius: 3,
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
                Balance
              </Typography>
              <Typography variant="h4" sx={{ color: "green", fontWeight: "bold" }}>
                {balance}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    );
  }

  if (mfaStatus === 200) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 400 }}>
          <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
            Set up MFA using Authenticator app
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Open your authenticator app, choose Show QR code on
            this page, then use the app to scan the code. 
            Alternatively, you can type a secret key.
            <span 
              style={{ color: '#3b82f6', cursor: 'pointer' }} 
              onClick={() => setShowSecretKey(!showSecretKey)}
            >
              {showSecretKey ? " (Hide secret key)" : " (Show secret key)"}
            </span>
          </Typography>

          {/* Conditionally show the MFA secret key */}
          {showSecretKey && (
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
              MFA Secret Key: {mfaSecret}
            </Typography>
          )}

          <img src={qrCode} alt="QR Code for MFA setup" style={{ maxWidth: "100%" }} />
          <TextField
            label="Enter code from Authenticator app"
            fullWidth
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            sx={{ marginTop: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmitCode}
            sx={{
              marginTop: 3,
              backgroundColor: '#3b82f6 !important',  // Force the background to blue
              color: '#ffffff !important',            // Force the text color to white
              '&:hover': {
                backgroundColor: '#1d4ed8 !important',  // Darker blue on hover
              },
            }}
          >
            Submit Code
          </Button>

          {statusMessage && (
            <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
              {statusMessage}
            </Typography>
          )}
        </Paper>
      </Box>
    );
  }

  return null;
}
