import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./componentes/paginas/login/login.jsx";
import Menu_ini from "./componentes/paginas/menu_ini/menu_principal.jsx";
import "./componentes/tema/Style.css";
import { Box } from "@mui/material";
import EquipamentosCatalogo from "./componentes/paginas/catalogos/equpamentos_catalogos.jsx";
import OrdensDeServicoCatalogo from "./componentes/paginas/catalogos/ordens_de_serviço_catalogo.jsx";
import ServicosCatalogo from "./componentes/paginas/catalogos/serviços_catalogo.jsx";
import Dashboard from "./componentes/paginas/dashboard/dashboard.jsx";

export default function App() {
  const [permissoes, setPermissoes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [telaAtual, setTelaAtual] = useState("dashboard");
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserEmail("");
    setTelaAtual("dashboard");
  };

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
      <Box id="bg">
        <Login handleLogin={handleLogin} />
      </Box>
    );
  }

  // Tela logada
  return (
    <>
      <Menu_ini trocarTela={setTelaAtual} onLogout={handleLogout} />
      {telaAtual === "dashboard" && <Dashboard />}
      {telaAtual === "equipamentos" && <EquipamentosCatalogo />}
      {telaAtual === "ordens" && <OrdensDeServicoCatalogo />}
      {telaAtual === "servicos" && <ServicosCatalogo />}
    </>
  );

}