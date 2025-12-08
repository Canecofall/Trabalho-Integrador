import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";

import { mascaraPreco } from "../../mascara/mascara";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Servico({ servicoId, modo, trocarTela }) {

  const [openMessage, setOpenMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSeverity, setMessageSeverity] = useState("success");

  const mostrarMensagem = (texto, tipo = "error") => {
    setMessageText(texto);
    setMessageSeverity(tipo);
    setOpenMessage(true);
  };

  const [servico, setServico] = useState({
    nome: "",
    preco: "",
    descricao: "",
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    if (servicoId && modo !== "criarServico") {
      axios
        .get(`http://localhost:3002/servicos/${servicoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const s = res.data;
          setServico({
            ...s,
            preco: mascaraPreco(String(s.preco))
          });
        })
        .catch((err) => console.error("Erro ao buscar serviço:", err));
    }
  }, [servicoId, modo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let novoValor = value;

    if (name === "preco") {
      novoValor = mascaraPreco(value);
    }

    setServico({ ...servico, [name]: novoValor });
  };

  // 🔍 VALIDAÇÃO DO FORMULÁRIO
  const validar = () => {
    const errosTemp = {};

    if (!servico.nome || !servico.nome.trim()) {
      errosTemp.nome = "O nome é obrigatório.";
    }

    if (!servico.descricao || !servico.descricao.trim()) {
      errosTemp.descricao = "A descrição é obrigatória.";
    }

    // PREÇO
    const precoLimpo = (servico.preco || "")
      .replace("R$ ", "")
      .replace(/\./g, "")
      .replace(",", ".");

    if (!precoLimpo || isNaN(Number(precoLimpo)) || Number(precoLimpo) <= 0) {
      errosTemp.preco = "Preço inválido.";
    } else if (Number(precoLimpo) > 999999.99) {
      errosTemp.preco = "Preço muito alto.";
    }


    setErros(errosTemp);
    return Object.keys(errosTemp).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar()) {
      if (erros.preco === "Preço muito alto.") {
        mostrarMensagem("O preço informado é muito grande!", "error");
      } else {
        mostrarMensagem("Existem erros no formulário!", "error");
      }
      return;
    }

    const dados = {
      nome: servico.nome,
      descricao: servico.descricao,
      preco: Number(
        servico.preco
          .replace("R$ ", "")
          .replace(/\./g, "")
          .replace(",", ".")
      )
    };

    try {
      if (modo === "criarServico") {
        await axios.post(
          "http://localhost:3002/servicos",
          dados,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        mostrarMensagem("Serviço criado com sucesso!", "success");
      } else {
        await axios.put(
          `http://localhost:3002/servicos/${servicoId}`,
          dados,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        mostrarMensagem("Serviço atualizado com sucesso!", "success");
      }

      setTimeout(() => trocarTela("servicos"), 800);

    } catch (err) {
      console.error("Erro ao salvar serviço:", err);
      mostrarMensagem("Erro ao salvar serviço!", "error");
    }
  };

  const somenteLeitura = modo === "verServico";

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {modo === "verServico" && "Visualizar Serviço"}
        {modo === "editarServico" && "Editar Serviço"}
        {modo === "criarServico" && "Criar Novo Serviço"}
      </Typography>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Dados do Serviço
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={servico.nome}
            onChange={handleChange}
            disabled={somenteLeitura}
            error={!!erros.nome}
            helperText={erros.nome}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            multiline
            label="Descrição"
            name="descricao"
            value={servico.descricao}
            onChange={handleChange}
            disabled={somenteLeitura}
            error={!!erros.descricao}
            helperText={erros.descricao}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Preço"
            name="preco"
            value={servico.preco}
            onChange={handleChange}
            disabled={somenteLeitura}
            error={!!erros.preco}
            helperText={erros.preco}
          />
        </Grid>

      </Grid>

      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => trocarTela("servicos")}
        >
          Voltar
        </Button>

        {(modo === "editarServico" || modo === "criarServico") && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSalvar}
          >
            {modo === "criarServico" ? "Criar Serviço" : "Salvar Alterações"}
          </Button>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={openMessage}
        autoHideDuration={3000}
        onClose={() => setOpenMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenMessage(false)}
          severity={messageSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {messageText}
        </Alert>
      </Snackbar>

    </Box>
  );
}
