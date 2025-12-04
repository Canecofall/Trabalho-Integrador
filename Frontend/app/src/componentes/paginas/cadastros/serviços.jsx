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
    descricao: "",
    preco: "",
  });

  useEffect(() => {
    if (servicoId && modo !== "criarServico") {
      // Buscar dados do backend
      // axios.get(`http://localhost:3002/servicos/${servicoId}`)
      //   .then(res => setServico(res.data))
      //   .catch(err => console.error(err));

      // Mock temporário
      setServico({
        nome: "Formatação de Notebook",
        descricao: "Instalação limpa do sistema operacional e drivers",
        preco: 150,
      });
    }
  }, [servicoId, modo]);

  const handleChange = (e) => {
    setServico({ ...servico, [e.target.name]: e.target.value });
  };

  const handleSalvar = () => {
    if (modo === "criarServico") {
      // axios.post("http://localhost:3002/servicos", servico)
      alert("Novo serviço criado!");
    } else {
      // axios.put(`http://localhost:3002/servicos/${servicoId}`, servico)
      alert("Serviço atualizado!");
    }
    trocarTela("servicos");
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
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={servico.nome}
            onChange={handleChange}
            disabled={modo === "verServico"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descrição"
            name="descricao"
            value={servico.descricao}
            onChange={handleChange}
            disabled={modo === "verServico"}
          />
        </Grid>
        <Grid item xs={12}>
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

      {/* Botões */}
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
