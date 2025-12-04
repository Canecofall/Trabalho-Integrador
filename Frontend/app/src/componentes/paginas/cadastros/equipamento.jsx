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

export default function EquipamentoArmazenado({ equipamentoId, modo, trocarTela }) {
  const [equipamento, setEquipamento] = useState({
    nomeCliente: "",
    cpfCnpj: "",
    contato: "",
    email: "",
    equipamento: "",
    marca: "",
    modelo: "",
    numeroSerie: "",
    defeito: "",
    perifericos: "",
    senha: "",
    dataEntrada: "",
    observacoes: "",
  });

  useEffect(() => {
    if (equipamentoId && modo !== "criarEquipamento") {
      // Buscar dados do backend
      // axios.get(`http://localhost:3002/equipamentos/${equipamentoId}`)
      //   .then(res => setEquipamento(res.data))
      //   .catch(err => console.error(err));

      // Mock temporário
      setEquipamento({
        nomeCliente: "Carlos Lima",
        cpfCnpj: "987.654.321-00",
        contato: "(47) 98888-8888",
        email: "carlos@email.com",
        equipamento: "Servidor IBM",
        marca: "IBM",
        modelo: "X3650",
        numeroSerie: "XYZ987654",
        defeito: "Não inicializa",
        perifericos: "Nenhum",
        senha: "senha456",
        dataEntrada: "2025-12-01",
        observacoes: "Equipamento armazenado aguardando orçamento",
      });
    }
  }, [equipamentoId, modo]);

  const handleChange = (e) => {
    setEquipamento({ ...equipamento, [e.target.name]: e.target.value });
  };

  const handleSalvar = () => {
    if (modo === "criarEquipamento") {
      // axios.post("http://localhost:3002/equipamentos", equipamento)
      alert("Novo equipamento armazenado!");
    } else {
      // axios.put(`http://localhost:3002/equipamentos/${equipamentoId}`, equipamento)
      alert("Equipamento atualizado!");
    }
    trocarTela("equipamentos");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {modo === "verEquipamento" && "Visualizar Equipamento Armazenado"}
        {modo === "editarEquipamento" && "Editar Equipamento Armazenado"}
        {modo === "criarEquipamento" && "Cadastrar Equipamento Armazenado"}
      </Typography>

      {/* Dados do Cliente */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Dados do Cliente
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Nome do Cliente" name="nomeCliente" value={equipamento.nomeCliente} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="CPF/CNPJ" name="cpfCnpj" value={equipamento.cpfCnpj} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Telefone" name="contato" value={equipamento.contato} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="E-mail" name="email" value={equipamento.email} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
      </Grid>

      {/* Dados do Equipamento */}
      <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>
        Dados do Equipamento
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Equipamento" name="equipamento" value={equipamento.equipamento} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Marca" name="marca" value={equipamento.marca} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Modelo" name="modelo" value={equipamento.modelo} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Nº de Série" name="numeroSerie" value={equipamento.numeroSerie} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Defeito Relatado" name="defeito" value={equipamento.defeito} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Periféricos" name="perifericos" value={equipamento.perifericos} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Senha" name="senha" value={equipamento.senha} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Data de Entrada" name="dataEntrada" value={equipamento.dataEntrada} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Observações" name="observacoes" value={equipamento.observacoes} onChange={handleChange} disabled={modo === "verEquipamento"} />
        </Grid>
      </Grid>

      {/* Botões */}
      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          type="button"
          onClick={() => trocarTela("equipamentos")}
        >
          Voltar
        </Button>
        {(modo === "editarEquipamento" || modo === "criarEquipamento") && (
          <Button
            variant="contained"
            color="primary"
            type="button"
            onClick={handleSalvar}
          >
            {modo === "criarEquipamento" ? "Cadastrar Equipamento" : "Salvar Alterações"}
          </Button>
        )}
      </Box>
    </Box>
  );
}
