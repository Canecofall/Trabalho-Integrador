import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Servico({ servicoId, modo, trocarTela }) {
  const [servico, setServico] = useState({
    nome: "",
    preco: "",
    descricao: "",
  });

  useEffect(() => {
    if (servicoId && modo !== "criarServico") {
      axios
        .get(`http://localhost:3002/servicos/${servicoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setServico(res.data))
        .catch((err) => console.error("Erro ao buscar serviço:", err));

    }
  }, [servicoId, modo]);

  const handleChange = (e) => {
    setServico({ ...servico, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    try {
      if (!servico.nome.trim()) {
        alert("Nome é obrigatório");
        return;
      }
      if (!servico.descricao.trim()) {
        alert("Descrição é obrigatória");
        return;
      }
      if (servico.preco === "" || isNaN(servico.preco)) {
        alert("Preço inválido");
        return;
      }

      const dados = {
        nome: servico.nome,
        descricao: servico.descricao,
        preco: parseFloat(servico.preco),
      };

      if (modo === "criarServico") {
        await axios.post(
          "http://localhost:3002/servicos",
          dados,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        alert("Serviço criado com sucesso!");
      } else {
        axios.put(`http://localhost:3002/servicos/${servicoId}`, dados, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        alert("Serviço atualizado com sucesso!");
      }

      trocarTela("servicos");

    } catch (err) {
      console.error("Erro ao salvar serviço:", err);
      alert("Erro ao salvar serviço. Veja o console.");
    }
  };


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
            disabled={modo === "verServico"}
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
            disabled={modo === "verServico"}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Preço"
            name="preco"
            value={servico.preco}
            onChange={handleChange}
            disabled={modo === "verServico"}
          />
        </Grid>

      </Grid>

      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          type="button"
          onClick={() => trocarTela("servicos")}
        >
          Voltar
        </Button>

        {(modo === "editarServico" || modo === "criarServico") && (
          <Button
            variant="contained"
            color="primary"
            type="button"
            onClick={handleSalvar}
          >
            {modo === "criarServico" ? "Criar Serviço" : "Salvar Alterações"}
          </Button>
        )}
      </Box>
    </Box>
  );
}
