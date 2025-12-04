import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

// Catálogo de serviços (mock)
const mockServicosCatalogo = [
  { id: 1, nome: "Formatação de Notebook", preco: 150 },
  { id: 2, nome: "Troca de HD para SSD", preco: 300 },
  { id: 3, nome: "Limpeza interna e troca de pasta térmica", preco: 120 },
];

export default function OrdemDeServico({ ordemId, modo, trocarTela }) {
  const [ordem, setOrdem] = useState({
    nome: "",
    cpfCnpj: "",
    cep: "",
    contato: "",
    nascimento: "",
    email: "",
    contribuinte: "",
    rg: "",
    inscricaoEstadual: "",
    equipamento: "",
    marca: "",
    defeito: "",
    perifericos: "",
    senha: "",
    numeroSerie: "",
    modelo: "",
  });

  // Serviços escolhidos para esta ordem
  const [servicosEscolhidos, setServicosEscolhidos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [qtd, setQtd] = useState(1);

  const handleChange = (e) => {
    setOrdem({ ...ordem, [e.target.name]: e.target.value });
  };

  const handleSalvar = () => {
    const ordemCompleta = { ...ordem, servicos: servicosEscolhidos };
    if (modo === "criarOrdem") {
      // axios.post("http://localhost:3002/ordens", ordemCompleta)
      alert("Nova ordem criada!");
    } else {
      // axios.put(`http://localhost:3002/ordens/${ordemId}`, ordemCompleta)
      alert("Ordem atualizada!");
    }
    trocarTela("ordens");
  };

  const adicionarServico = () => {
    const servico = mockServicosCatalogo.find((s) => s.id === servicoSelecionado);
    if (!servico) return;
    setServicosEscolhidos([
      ...servicosEscolhidos,
      { ...servico, qtd }
    ]);
    setServicoSelecionado("");
    setQtd(1);
  };

  useEffect(() => {
    if (ordemId && modo !== "criarOrdem") {
      // Buscar dados do backend
      // axios.get(`http://localhost:3002/ordens/${ordemId}`)
      //   .then(res => setOrdem(res.data))
      //   .catch(err => console.error(err));

      // Mock temporário
      setOrdem({
        nome: "João Silva",
        cpfCnpj: "123.456.789-00",
        cep: "89000-000",
        contato: "(47) 99999-9999",
        nascimento: "1990-01-01",
        email: "joao@email.com",
        contribuinte: "Sim",
        rg: "1234567",
        inscricaoEstadual: "987654",
        equipamento: "Notebook Dell",
        marca: "Dell",
        defeito: "Não liga",
        perifericos: "Carregador",
        senha: "senha123",
        numeroSerie: "ABC123456",
        modelo: "Inspiron 15",
      });
    }
  }, [ordemId, modo]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {modo === "verOrdem" && "Visualizar Ordem de Serviço"}
        {modo === "editarOrdem" && "Editar Ordem de Serviço"}
        {modo === "criarOrdem" && "Criar Nova Ordem de Serviço"}
      </Typography>

      {/* Dados do Cliente */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Dados do Cliente
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Nome" name="nome" value={ordem.nome} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="CPF/CNPJ" name="cpfCnpj" value={ordem.cpfCnpj} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Telefone" name="contato" value={ordem.contato} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="E-mail" name="email" value={ordem.email} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Contribuinte" name="contribuinte" value={ordem.contribuinte} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="RG" name="rg" value={ordem.rg} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Data de Nascimento" name="nascimento" value={ordem.nascimento} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Inscrição Estadual" name="inscricaoEstadual" value={ordem.inscricaoEstadual} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="CEP" name="cep" value={ordem.cep} onChange={handleChange} />
        </Grid>
      </Grid> {/* Dados do Equipamento */}
      <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>
        Dados do Equipamento
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Equipamento" name="equipamento" value={ordem.equipamento} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Marca" name="marca" value={ordem.marca} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Problema Técnico" name="defeito" value={ordem.defeito} onChange={handleChange} />
        </Grid> <Grid item xs={12}>
          <TextField fullWidth label="Periféricos (carregador, teclado...)" name="perifericos" value={ordem.perifericos} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Senha" name="senha" value={ordem.senha} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Nº de Série" name="numeroSerie" value={ordem.numeroSerie} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Modelo" name="modelo" value={ordem.modelo} onChange={handleChange} />
        </Grid>
      </Grid>
 {/* Seleção de Serviços */}
      <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>
        Serviços
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Select
            fullWidth
            value={servicoSelecionado}
            onChange={(e) => setServicoSelecionado(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">
              <em>Selecione um serviço</em>
            </MenuItem>
            {mockServicosCatalogo.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.nome} - R$ {s.preco}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            type="number"
            label="Qtd"
            value={qtd}
            onChange={(e) => setQtd(Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={adicionarServico}
            sx={{ height: "100%" }}
          >
            Adicionar
          </Button>
        </Grid>
      </Grid>

      {/* Lista de serviços escolhidos */}
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Qtd</TableCell>
            <TableCell>Preço</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {servicosEscolhidos.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.nome}</TableCell>
              <TableCell>{s.qtd}</TableCell>
              <TableCell>R$ {s.preco}</TableCell>
              <TableCell>R$ {s.qtd * s.preco}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Botões de ação */}
      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          type="button"
          onClick={() => trocarTela("ordens")}
        >
          Voltar
        </Button>
        {(modo === "editarOrdem" || modo === "criarOrdem") && (
          <Button variant="contained" color="primary" type="button" onClick={handleSalvar}>
            {modo === "criarOrdem" ? "Criar Ordem" : "Salvar Alterações"}
          </Button>
        )}
      </Box>
    </Box>
  );
}
