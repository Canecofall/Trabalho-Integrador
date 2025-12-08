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
  Snackbar,
  Alert
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

export default function OrdemDeServico({ ordemId, modo, trocarTela }) {
  const [ordem, setOrdem] = useState({
    id_cliente: "",
    equipamento: "",
    marca: "",
    modelo: "",
    numero_serie: "",
    defeito: "",
    perifericos: "",
    senha: "",
  });

  const [clientes, setClientes] = useState([]);
  const [catalogoServicos, setCatalogoServicos] = useState([]);
  const [dadosCliente, setDadosCliente] = useState(null);

  const [servicosEscolhidos, setServicosEscolhidos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [qtd, setQtd] = useState(1);
  const [openMessage, setOpenMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSeverity, setMessageSeverity] = useState("error");

  const mostrarMensagem = (texto, tipo = "error") => {
    setMessageText(texto);
    setMessageSeverity(tipo);
    setOpenMessage(true);
  };

  const removerServico = (id) => {
    setServicosEscolhidos((prev) =>
      prev.filter((s) => s.id !== id)
    );
  };

  const token = localStorage.getItem("token");

  //   CARREGAR CLIENTES E SERVIÇOS
  useEffect(() => {
    const carregar = async () => {
      try {
        const cli = await axios.get("http://localhost:3002/clientes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(cli.data);

        const serv = await axios.get("http://localhost:3002/servicos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCatalogoServicos(serv.data);

      } catch (error) {
        console.error("Erro carregando dados:", error);
      }
    };

    carregar();
  }, [token]);

  //   ALTERAÇÃO DE CAMPOS
  const handleChange = (e) => {
    const { name, value } = e.target;

    setOrdem({ ...ordem, [name]: value });

    // Seleção de cliente — preencher dados automaticamente
    if (name === "id_cliente") {
      const cli = clientes.find((c) => c.id == value);
      setDadosCliente(cli || null);
    }
  };

  //   CARREGAR ORDEM EXISTENTE (VER/EDITAR)
  useEffect(() => {
    if (!ordemId || modo === "criarOrdem") return;

    axios
      .get(`http://localhost:3002/ordens/${ordemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const dados = res.data;

        // Preenche ordem
        setOrdem({
          id_cliente: dados.id_cliente,
          equipamento: dados.equipamento,
          marca: dados.marca,
          modelo: dados.modelo,
          numero_serie: dados.numero_serie,
          defeito: dados.defeito,
          perifericos: dados.perifericos,
          senha: dados.senha,
        });

        // Preenche dados do cliente automaticamente
        setDadosCliente(dados.cliente);

        // Preenche itens
        setServicosEscolhidos(
          dados.itens?.map((i) => ({
            id: i.id_servico,
            nome: i.servico.nome,
            preco: i.preco,
            qtd: i.quantidade,
          })) || []
        );
      })
      .catch((e) => console.error("Erro carregando OS:", e));
  }, [ordemId, modo, token]);

  // ADICIONAR SERVIÇO
  const adicionarServico = () => {
    const servico = catalogoServicos.find((s) => s.id === servicoSelecionado);
    if (!servico) return;

    setServicosEscolhidos([
      ...servicosEscolhidos,
      { id: servico.id, nome: servico.nome, preco: servico.preco, qtd },
    ]);

    setServicoSelecionado("");
    setQtd(1);
  };
  //validar campos da ordem de serviço
  const validarOrdem = () => {
    if (!ordem.id_cliente) {
      mostrarMensagem("Selecione um cliente antes de salvar!", "error");
      return false;
    }

    if (!ordem.equipamento.trim()) {
      mostrarMensagem("O campo Equipamento é obrigatório!", "error");
      return false;
    }

    return true;
  };

  // SALVAR OS (POST / PUT)
  const handleSalvar = async () => {
    if (!validarOrdem()) return;

    const payload = {
      ...ordem,
      itens: servicosEscolhidos.map((s) => ({
        id_servico: s.id,
        quantidade: s.qtd,
        preco: s.preco,
      })),
    };


    try {
      if (modo === "criarOrdem") {
        await axios.post("http://localhost:3002/ordens", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        mostrarMensagem("Ordem criada com sucesso!", "success");
      } else {
        await axios.put(`http://localhost:3002/ordens/${ordemId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        mostrarMensagem("Ordem atualizada com sucesso!", "success");
      }

      setTimeout(() => trocarTela("ordens"), 800);

    } catch (e) {
      console.error("Erro ao salvar OS:", e);
      mostrarMensagem("Erro ao salvar a ordem de serviço!", "error");
    }
  };

  //   INTERFACE
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {modo === "verOrdem" && "Visualizar Ordem de Serviço"}
        {modo === "editarOrdem" && "Editar Ordem de Serviço"}
        {modo === "criarOrdem" && "Criar Nova Ordem de Serviço"}
      </Typography>

      {/* CLIENTE */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Cliente
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Select
            fullWidth
            name="id_cliente"
            value={clientes.length > 0 ? ordem.id_cliente : ""}
            onChange={handleChange}
            disabled={modo === "verOrdem"}
          >
            <MenuItem value="">
              <em>Selecione um cliente</em>
            </MenuItem>

            {clientes.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nome}
              </MenuItem>
            ))}
          </Select>

        </Grid>
      </Grid>

      {/* EXIBE DADOS DO CLIENTE */}
      {dadosCliente && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            Dados do Cliente (não editáveis)
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {[
              ["Nome", dadosCliente.nome],
              ["CPF/CNPJ", dadosCliente.cpf_cnpj],
              ["Telefone", dadosCliente.telefone],
              ["E-mail", dadosCliente.email],
              ["CEP", dadosCliente.cep],
              ["RG", dadosCliente.rg],
              ["Nascimento", dadosCliente.nascimento],
              ["Contribuinte", dadosCliente.contribuinte],
              ["Inscrição Estadual", dadosCliente.inscricao_estadual],
            ].map(([label, value]) => (
              <Grid size={{ xs: 12, md: 4 }} key={label}>
                <TextField label={label} value={value || ""} fullWidth disabled />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* EQUIPAMENTO */}
      <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>
        Dados do Equipamento
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        {[
          ["Equipamento", "equipamento"],
          ["Marca", "marca"],
          ["Modelo", "modelo"],
          ["Nº de Série", "numero_serie"],
          ["Defeito", "defeito"],
          ["Periféricos", "perifericos"],
          ["Senha", "senha"],
        ].map(([label, name]) => (
          <Grid size={{ xs: 12, md: 3 }} key={name}>
            <TextField
              fullWidth
              label={label}
              name={name}
              value={ordem[name]}
              onChange={handleChange}
              disabled={modo === "verOrdem"}
            />
          </Grid>
        ))}
      </Grid>

      {/* SERVIÇOS */}
      {modo !== "verOrdem" && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>
            Serviços
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Select
                fullWidth
                value={servicoSelecionado}
                onChange={(e) => setServicoSelecionado(e.target.value)}
              >
                <MenuItem value="">
                  <em>Selecione um serviço</em>
                </MenuItem>
                {catalogoServicos.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.nome} — R$ {s.preco}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                type="number"
                label="Qtd"
                fullWidth
                value={qtd}
                onChange={(e) => setQtd(Number(e.target.value))}
              />
            </Grid>

            <Grid size={{ xs: 6, md: 3 }}>
              <Button variant="contained" sx={{ height: "100%" }} onClick={adicionarServico}>
                Adicionar
              </Button>
            </Grid>
          </Grid>
        </>
      )}

      {/* TABELA DE SERVIÇOS */}
      {servicosEscolhidos.length > 0 && (
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Serviço</TableCell>
              <TableCell>Qtd</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicosEscolhidos.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.nome}</TableCell>
                <TableCell>{s.qtd}</TableCell>
                <TableCell>R$ {s.preco}</TableCell>
                <TableCell>R$ {(s.qtd * s.preco).toFixed(2)}</TableCell>

                {/*Botão de Remover*/}
                <TableCell>
                  {modo !== "verOrdem" && (
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => removerServico(s.id)}
                    >
                      Remover
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      )}

      {/* BOTÕES */}
      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={() => trocarTela("ordens")}>
          Voltar
        </Button>

        {(modo === "criarOrdem" || modo === "editarOrdem") && (
          <Button variant="contained" onClick={handleSalvar}>
            {modo === "criarOrdem" ? "Criar Ordem" : "Salvar Alterações"}
          </Button>
        )}
      </Box>
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
