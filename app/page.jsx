// app/dashboard.jsx

"use client";

import Link from "next/link";
import { useUserContext } from "@/app/user-context";
import { useState, useEffect } from "react";
import { Box, Container, Typography, Paper, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import axios from "axios";

// Функция для извлечения CSRF-токена из куков
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
  const [loading, setLoading] = useState(false); // для индикации загрузки
  const [statusMessage, setStatusMessage] = useState(null); // для сообщений об ошибках/статусах

  useEffect(() => {
    if (user.isAuthenticated) {
      // Заменить на API вызов для получения баланса
      setBalance("$10,000"); // Мок-данные баланса для демонстрации

      handleLinkTotp(); // Запускаем запрос для проверки MFA и получения QR-кода
    }
  }, [user]);

  const handleLinkTotp = async () => {
    setLoading(true);
    setStatusMessage(null);

    try {
      // Получаем CSRF-токен из куки
      const csrfToken = getCsrfToken();

      if (!csrfToken) {
        setStatusMessage("CSRF token not found.");
        setLoading(false);
        return;
      }

      // Запрос на получение статуса MFA и QR-кода с передачей CSRF-токена
      const response = await axios.post("/auth/oauth2/generate-qr-code", null, {
        headers: {
          'X-CSRF-Token': csrfToken, // Передаем CSRF-токен в заголовках
        },
        withCredentials: true, // Для передачи cookies с запросом
      });

      if (response.status === 200) {
        setMfaStatus(200);
        setQrCode(response.data.qrCode);
      }
    } catch (error) {
      if (error.response && error.response.status === 404 && error.response.data.error === "E016") {
        setMfaStatus(404); // MFA уже включен
      } else {
        setStatusMessage("Error occurred while generating QR code.");
      }
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

  // Показать статус загрузки или сообщение об ошибке
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // if (statusMessage) {
  //   return (
  //     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
  //       <Typography variant="h6" color="error">
  //         {statusMessage}
  //       </Typography>
  //     </Box>
  //   );
  // }

  // Если MFA не включен и мы получили QR-код, показываем страницу с QR-кодом
  // if (mfaStatus === 200) {
  //   return (
  //     <Box sx={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
  //       <Paper
  //         elevation={3}
  //         sx={{
  //           padding: 4,
  //           maxWidth: 400,
  //           backgroundColor: "white",
  //           borderRadius: 3,
  //           boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
  //         }}
  //       >
  //         <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
  //           Set up MFA
  //         </Typography>
  //         <Typography variant="body1" sx={{ marginBottom: 2 }}>
  //           Scan the QR code below to enable MFA for your account.
  //         </Typography>
  //         <img src={qrCode} alt="QR Code for MFA setup" style={{ maxWidth: "100%" }} />
  //       </Paper>
  //     </Box>
  //   );
  // }

  // Если MFA уже включен, показываем текущий Dashboard
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
