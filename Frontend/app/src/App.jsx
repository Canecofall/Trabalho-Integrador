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
import EquipamentosCatalogo from "./componentes/paginas/catalogos/equpamentos_catalogos.jsx";
import EquipamentoArmazenado from "./componentes/paginas/cadastros/equipamento.jsx";

export default function App() {
  const [permissoes, setPermissoes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [telaAtual, setTelaAtual] = useState("dashboard");
  const [ordemSelecionada, setOrdemSelecionada] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [EquipamentoSelecionado, setEquipamentoSelecionado] = useState(null);

  const telasSemMenu = [
    "verOrdem", "editarOrdem", "criarOrdem",
    "verServico", "editarServico", "criarServico",
    "verEquipamento", "editarEquipamento", "criarEquipamento"
  ];
  const trocarTela = (novaTela, id = null) => {
    setTelaAtual(novaTela);
    if (novaTela.includes("Ordem")) {
      setOrdemSelecionada(id);
    }
    if (novaTela.includes("Servico")) {
      setServicoSelecionado(id);
    }
    if (novaTela.includes("Equipamento")) {
      setEquipamentoSelecionado(id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserEmail("");
    setTelaAtual("dashboard");
  };

  const buscarPermissoesPorEmail = async (email) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:3002/usuario_permissao/usuario/${email}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // --- CONVERSÃO CORRETA ---
    const lista = response.data.permissoes.map(
      (p) => p.Permissao.descricao
    );

    console.log("Permissões convertidas:", lista);
    
    setPermissoes(lista); // <<<<<<<<<< AGORA SIM

  } catch (error) {
    console.log(error);
  }
};


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
  useEffect(() => {
    console.log("Permissões recebidas:", permissoes);
  }, [permissoes]);

  useEffect(() => {
    // Busca permissões quando o usuário estiver logado e tiver email
    if (isLoggedIn && userEmail) {
      buscarPermissoesPorEmail(userEmail);
    }
  }, [isLoggedIn, userEmail]);

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
    // Verifica se há token no localStorage ao carregar
    const token = localStorage.getItem("token");
    if (token) {
      // Tenta decodificar o token para obter o email do usuário
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


  if (!isLoggedIn) {
    return (
      <Box id="bg">
        <Login handleLogin={handleLogin} />
      </Box>
    );
  }

  return (
    <>
    
      {!telasSemMenu.includes(telaAtual) && (
        <Menu_ini trocarTela={trocarTela} onLogout={handleLogout} />
      )}
      {telaAtual === "dashboard" && <Dashboard />}
      {telaAtual === "equipamentos" && (
        <EquipamentosCatalogo trocarTela={trocarTela} permissoes={permissoes} />)}
      {telaAtual === "servicos" && (
        <ServicoCatalogo trocarTela={trocarTela} permissoes={permissoes} />)}
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
      {(telaAtual === "verEquipamento" || telaAtual === "editarEquipamento" || telaAtual === "criarEquipamento") && (
        <EquipamentoArmazenado
          equipamentoId={EquipamentoSelecionado}
          modo={telaAtual}
          trocarTela={trocarTela}
        />
      )}
    </>
  );
}