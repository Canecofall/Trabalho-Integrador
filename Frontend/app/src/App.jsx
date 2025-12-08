import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./componentes/paginas/login/login.jsx";
import Menu_ini from "./componentes/paginas/menu_ini/menu_principal.jsx";
import "./componentes/tema/Style.css";
import { Box } from "@mui/material";
import Dashboard from "./componentes/paginas/dashboard/dashboard.jsx";
import OrdemDeServico from "./componentes/paginas/cadastros/ordens_de_serviço.jsx";
import OrdensDeServicoCatalogo from "./componentes/paginas/catalogos/ordens_de_serviço_catalogo.jsx";
import ServicoCatalogo from "./componentes/paginas/catalogos/serviços_catalogo.jsx";
import Servico from "./componentes/paginas/cadastros/serviços.jsx";

import ClientesCatalogo from "./componentes/paginas/catalogos/cliente_catalogo.jsx";
import ClienteForm from "./componentes/paginas/cadastros/cliente.jsx";

export default function App() {
  const [permissoes, setPermissoes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [telaAtual, setTelaAtual] = useState("dashboard");

  const [ordemSelecionada, setOrdemSelecionada] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const telasSemMenu = [
    "verOrdem", "editarOrdem", "criarOrdem",
    "verServico", "editarServico", "criarServico",
    "verCliente", "editarCliente", "criarCliente"
  ];

  // FUNÇÕES AUXILIARES


  // decodificar token
  const decodeToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      return null;
    }
  };

  // buscar permisoes por email
  const buscarPermissoesPorEmail = async (email) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:3002/usuario_permissao/usuario/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPermissoes(response.data.permissoes || []);
    } catch (error) {
      console.error("Erro ao buscar permissões:", error);
      setPermissoes([]);
    }
  };

  const trocarTela = (novaTela, id = null) => {
    setTelaAtual(novaTela);

    // ORDEM DE SERVIÇO
    if (novaTela.startsWith("verOrdem") || novaTela.startsWith("editarOrdem") || novaTela.startsWith("criarOrdem")) {
      setOrdemSelecionada(id);
    }

    // SERVIÇOS
    if (novaTela.startsWith("verServico") || novaTela.startsWith("editarServico") || novaTela.startsWith("criarServico")) {
      setServicoSelecionado(id);
    }

    // CLIENTES
    if (novaTela.startsWith("verCliente") || novaTela.startsWith("editarCliente") || novaTela.startsWith("criarCliente")) {
      setClienteSelecionado(id);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setPermissoes([]);
    localStorage.removeItem("token");
  };

  const handleLogin = (success, username = null) => {
    if (success) {
      if (username) {
        setUserEmail(username);
      } else {
        const payload = decodeToken();
        if (payload?.username) {
          setUserEmail(payload.username);
        }
      }
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setUserEmail("");
      localStorage.removeItem("token");
    }
  };

  //  INICIALIZAÇÃO DO USUÁRIO

  useEffect(() => {
    const payload = decodeToken();
    if (payload?.username) {
      setUserEmail(payload.username);
      setIsLoggedIn(true);
    }
  }, []);

  //  BUSCAR PERMISSÕES QUANDO LOGAR

  useEffect(() => {
    if (isLoggedIn && userEmail) {
      buscarPermissoesPorEmail(userEmail);
    }
  }, [isLoggedIn, userEmail]);

  // DEBUG
  useEffect(() => {
    console.log("Permissões carregadas:", permissoes);
  }, [permissoes]);

  //  LOGIN
  if (!isLoggedIn) {
    return (
      <Box id="bg">
        <Login handleLogin={handleLogin} />
      </Box>
    );
  }

  //  RENDERIZAÇÃO PRINCIPAL
  return (
    <>
      {!telasSemMenu.includes(telaAtual) && (
        <Menu_ini trocarTela={trocarTela} onLogout={handleLogout} />
      )}

      {telaAtual === "dashboard" && <Dashboard />}


      {/* CLIENTES */}
      {telaAtual === "clientes" && (
        <ClientesCatalogo trocarTela={trocarTela} permissoes={permissoes} />
      )}


      {telaAtual === "servicos" && (
        <ServicoCatalogo trocarTela={trocarTela} permissoes={permissoes} />
      )}

      {telaAtual === "ordens" && (
        <OrdensDeServicoCatalogo trocarTela={trocarTela} permissoes={permissoes} />
      )}

      {(telaAtual === "verOrdem" || telaAtual === "editarOrdem" || telaAtual === "criarOrdem") && (
        <OrdemDeServico
          ordemId={ordemSelecionada}
          modo={telaAtual}
          trocarTela={trocarTela}
        />
      )}

      {(telaAtual === "verServico" || telaAtual === "editarServico" || telaAtual === "criarServico") && (
        <Servico
          servicoId={servicoSelecionado}
          modo={telaAtual}
          trocarTela={trocarTela}
        />
      )}

      {(telaAtual === "verCliente" || telaAtual === "editarCliente" || telaAtual === "criarCliente") && (
        <ClienteForm
          clienteId={clienteSelecionado}
          modo={telaAtual}
          trocarTela={trocarTela}
        />
      )}
    </>
  );
}
