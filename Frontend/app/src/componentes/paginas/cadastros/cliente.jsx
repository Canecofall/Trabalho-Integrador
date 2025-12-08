import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Divider, 
} from "@mui/material";
import axios from "axios";
// mascara
import {
  mascaraCpfCnpj,
  mascaraTelefone,
  mascaraCEP,
  mascaraData
} from "../../mascara/mascara";

import { useEffect, useState } from "react";

export default function ClienteForm({ clienteId, modo, trocarTela }) {

  const [cliente, setCliente] = useState({
    nome: "",
    cpf_cnpj: "",
    telefone: "",
    email: "",
    cep: "",
    rg: "",
    nascimento: "",
    contribuinte: "",
    inscricao_estadual: ""
  });

  const token = localStorage.getItem("token");

  // aplicação
  const handleChange = (e) => {
  const { name, value } = e.target;

  let novoValor = value;

  if (name === "cpf_cnpj") novoValor = mascaraCpfCnpj(value);
  if (name === "telefone") novoValor = mascaraTelefone(value);
  if (name === "cep") novoValor = mascaraCEP(value);
  if (name === "nascimento") novoValor = mascaraData(value);

  setCliente({ ...cliente, [name]: novoValor });
};


  useEffect(() => {
    if (!clienteId) return;

    axios.get(`http://localhost:3002/clientes/${clienteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCliente(res.data))
    .catch(err => console.error(err));

  }, [clienteId]);

  const handleSalvar = async () => {
    try {
      if (modo === "criarCliente") {
        await axios.post("http://localhost:3002/clientes", cliente, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Cliente criado!");
      } else {
        await axios.put(`http://localhost:3002/clientes/${clienteId}`, cliente, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Cliente atualizado!");
      }

      trocarTela("clientes");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar cliente");
    }
  };

  const somenteLeitura = modo === "verCliente";

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {modo === "verCliente" && "Visualizar Cliente"}
        {modo === "editarCliente" && "Editar Cliente"}
        {modo === "criarCliente" && "Criar Novo Cliente"}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {[
          ["Nome", "nome"],
          ["CPF/CNPJ", "cpf_cnpj"],
          ["Telefone", "telefone"],
          ["Email", "email"],
          ["CEP", "cep"],
          ["RG", "rg"],
          ["Nascimento", "nascimento"],
          ["Contribuinte", "contribuinte"],
          ["Inscrição Estadual", "inscricao_estadual"],
        ].map(([label, field]) => (
          
          <Grid
            item
            key={field}
            sx={{
              width: { xs: "100%", sm: "50%", md: "33%" } // substitui xs/md
            }}
          >
            <TextField
              fullWidth
              label={label}
              name={field}
              value={cliente[field] || ""}
              onChange={handleChange}
              disabled={somenteLeitura}
            />
          </Grid>

        ))}
      </Grid>

      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={() => trocarTela("clientes")}>
          Voltar
        </Button>

        {modo !== "verCliente" && (
          <Button variant="contained" onClick={handleSalvar}>
            Salvar
          </Button>
        )}
      </Box>
    </Box>
  );
}
