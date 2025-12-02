  import { useState, useEffect } from "react";
  import axios from "axios";
  import Login from "./componentes/paginas/login/login.jsx";
  import Menu_ini from "./componentes/paginas/menu_ini/menu_principal.jsx";
  import { Box, Stack, Typography } from "@mui/material";

  export default function App() {
    const [permissoes, setPermissoes] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.username) {
            setUserEmail(payload.username);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("Erro ao decodificar token:", error);
          localStorage.removeItem("token");
        }
      }
    }, []);

    useEffect(() => {
      if (isLoggedIn && userEmail) {
        buscarPermissoesPorEmail(userEmail);
      }
    }, [isLoggedIn, userEmail]);

    const buscarPermissoesPorEmail = async (email) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3002/usuario_permissao/usuario/${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPermissoes(response.data.permissoes);
      } catch (error) {
        console.log(error);
      }
    };
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.get("http://localhost:3002/validar-token", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUserEmail(res.data.username);
      setIsLoggedIn(true);
    })
    .catch(() => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    });
  }
}, []);

    const handleLogin = (success, username = null) => {
      if (success) {
        if (username) setUserEmail(username);

        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
        localStorage.removeItem("token");
      }
    };

    // Se não estiver logado → mostra login
    if (!isLoggedIn) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Stack spacing={2} alignItems="center">
            <Typography variant="h4">Login</Typography>
            <Login handleLogin={handleLogin} />
          </Stack>
        </Box>
      );
    }

    // Tela logada
    return (
      <>
      <Menu_ini></Menu_ini>
      </>
    );
  }
