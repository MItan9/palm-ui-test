import { useUserContext } from "@/app/user-context";
import axios from "axios";
import https from "https";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Box, Button, Select, MenuItem, Modal, CircularProgress } from "@mui/material";

const LoginExperience = {
  DEFAULT: 0,
  IFRAME: 1,
};

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_REVERSE_PROXY_URI}`,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

async function getLoginOptions() {
  const response = await axiosInstance.get("/bff/login-options");
  return response.data;
}

export default function Login({ onLogin }) {
  const user = useUserContext();
  const [loginUri, setLoginUri] = useState("");
  const [selectedLoginExperience, setSelectedLoginExperience] = useState(LoginExperience.DEFAULT);
  const [isLoginModalDisplayed, setIsLoginModalDisplayed] = useState(false);
  const [isIframeLoginPossible, setIframeLoginPossible] = useState(false);
  const [loading, setLoading] = useState(true); // состояние загрузки всей формы
  const currentPath = usePathname();
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    iframe?.addEventListener("load", onIframeLoad);

    fetchLoginOptions(); // загружаем опции логина

    return () => {
      iframe?.removeEventListener("load", onIframeLoad);
    };
  }, []);

  async function fetchLoginOptions() {
    try {
      const loginOpts = await getLoginOptions();
      if (loginOpts?.length < 1 || !loginOpts[0].loginUri) {
        setLoginUri("");
        setIframeLoginPossible(false);
      } else {
        setLoginUri(loginOpts[0].loginUri);
        setIframeLoginPossible(true);
      }
    } catch (error) {
      console.error("Error fetching login options:", error);
    } finally {
      setLoading(false); // заканчиваем загрузку после получения данных
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!loginUri) {
      return;
    }
    const url = new URL(loginUri);
    url.searchParams.append(
      "post_login_success_uri",
      `${process.env.NEXT_PUBLIC_BASE_URI}${currentPath}`
    );
    url.searchParams.append(
      "post_login_failure_uri",
      `${process.env.NEXT_PUBLIC_BASE_URI}/login-error`
    );
    const loginUrl = url.toString();
    if (selectedLoginExperience === LoginExperience.IFRAME && iframeRef.current) {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.src = loginUrl;
        setIsLoginModalDisplayed(true);
      }
    } else {
      window.location.href = loginUrl;
    }
  }

  function onIframeLoad() {
    if (isLoginModalDisplayed) {
      onLogin({});
    }
  }

  // Если загрузка продолжается, показываем индикатор загрузки для всей формы
  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Форма с селектором и кнопкой */}
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          padding: 1, 
          gap: 1, 
          marginTop: 0.5, 
          marginRight: 1, 
        }}
      >
        {isIframeLoginPossible && (
          <Select
            value={selectedLoginExperience}
            onChange={(e) => setSelectedLoginExperience(parseInt(e.target.value, 10))}
            fullWidth
            sx={{
              width: '150px', // Уменьшаем ширину
              height: '40px', // Уменьшаем высоту
              bgcolor: 'primary.main',
              color: 'white',
            }}
          >
            <MenuItem value={LoginExperience.DEFAULT}>Default</MenuItem>
            <MenuItem value={LoginExperience.IFRAME}>
              Iframe
            </MenuItem>
          </Select>
        )}
        <Button
          variant="contained"
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700"
          sx={{
            backgroundColor: '#1565c0',
            color: 'white',
            width: '150px', 
            height: '40px', 
            opacity: 1,
            boxShadow: 'none',
            marginLeft: '8px',
          }}
        >
          Login
        </Button>
      </Box>

      {/* Модальное окно для логина через iframe */}
      <Modal
        open={isLoginModalDisplayed && !user.isAuthenticated}
        onClose={() => setIsLoginModalDisplayed(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            maxWidth: '600px',
            width: '100%',
            position: 'relative',
          }}
        >
          <iframe ref={iframeRef} style={{ width: '100%', height: '400px', border: 'none' }} />
        </Box>
      </Modal>
    </Box>
  );
}
