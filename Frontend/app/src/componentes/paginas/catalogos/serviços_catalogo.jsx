import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  TablePagination,
} from "@mui/material";

export default function ServicosCatalogo({ trocarTela, permissoes = [] }) {
  const [servicos, setServicos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Ordenação
  const [ordem, setOrdem] = useState("asc");
  const [campoOrdenacao, setCampoOrdenacao] = useState("id");

  // Permissões
  const podeVer = permissoes.some(p => p.Permissao.descricao === "VER");
  const podeEditar = permissoes.some(p => p.Permissao.descricao === "EDITAR");
  const podeDeletar = permissoes.some(p => p.Permissao.descricao === "DELETAR");
  const podeCriar = permissoes.some(p => p.Permissao.descricao === "CRIAR");

  const carregarServicos = async () => {
    try {
      const res = await axios.get("http://localhost:3002/servicos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setServicos(res.data);

    } catch (erro) {
      console.error("Erro ao buscar serviços:", erro);
      alert("Erro ao carregar serviços.");
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  const alterarOrdenacao = (campo) => {
    if (campoOrdenacao === campo) {
      setOrdem(ordem === "asc" ? "desc" : "asc");
    } else {
      setCampoOrdenacao(campo);
      setOrdem("asc");
    }
  };

  const servicosFiltrados = servicos.filter(
    (s) =>
      s.id?.toString().includes(pesquisa) ||
      s.nome?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const servicosOrdenados = [...servicosFiltrados].sort((a, b) => {
    const campo = campoOrdenacao;

    if (["id", "preco"].includes(campo)) {
      return ordem === "asc"
        ? Number(a[campo]) - Number(b[campo])
        : Number(b[campo]) - Number(a[campo]);
    }

    return ordem === "asc"
      ? String(a[campo]).localeCompare(String(b[campo]))
      : String(b[campo]).localeCompare(String(a[campo]));
  });

  const servicosPaginados = servicosOrdenados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      await axios.delete(`http://localhost:3002/servicos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setServicos((prev) => prev.filter((s) => s.id !== id));

    } catch (erro) {
      console.error("Erro ao deletar:", erro);
      alert("Erro ao deletar serviço.");
    }
  };

  return (
    <div id="bg">
      <Box sx={{ p: 3 }}>

        <TextField
          label="Pesquisar por Nº ou Nome"
          fullWidth
          margin="normal"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>

                <TableCell
                  onClick={() => alterarOrdenacao("id")}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  ID {campoOrdenacao === "id" ? (ordem === "asc" ? "▲" : "▼") : ""}
                </TableCell>

                <TableCell
                  onClick={() => alterarOrdenacao("nome")}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  Nome {campoOrdenacao === "nome" ? (ordem === "asc" ? "▲" : "▼") : ""}
                </TableCell>

                <TableCell
                  onClick={() => alterarOrdenacao("descricao")}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  Descrição {campoOrdenacao === "descricao" ? (ordem === "asc" ? "▲" : "▼") : ""}
                </TableCell>

                <TableCell
                  onClick={() => alterarOrdenacao("preco")}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  Preço {campoOrdenacao === "preco" ? (ordem === "asc" ? "▲" : "▼") : ""}
                </TableCell>

                <TableCell><b>Ações</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {servicosPaginados.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.nome}</TableCell>
                  <TableCell>{s.descricao}</TableCell>
                  <TableCell>R$ {Number(s.preco).toFixed(2)}</TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {podeVer && (
                        <Button
                          variant="outlined"
                          onClick={() => trocarTela("verServico", s.id)}
                        >
                          Ver
                        </Button>
                      )}

                      {podeEditar && (
                        <Button
                          variant="outlined"
                          color="warning"
                          onClick={() => trocarTela("editarServico", s.id)}
                        >
                          Editar
                        </Button>
                      )}

                      {podeDeletar && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(s.id)}
                        >
                          Deletar
                        </Button>
                      )}
                    </Stack>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={servicosOrdenados.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />

        {podeCriar && (
          <Stack direction="row-reverse" sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => trocarTela("criarServico")}>
              Criar Serviço
            </Button>
          </Stack>
        )}

      </Box>
    </div>
  );
}
