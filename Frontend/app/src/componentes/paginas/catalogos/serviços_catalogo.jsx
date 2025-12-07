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
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ESTADOS PARA ORDENAÇÃO
  const [ordem, setOrdem] = useState("asc");
  const [campoOrdenacao, setCampoOrdenacao] = useState("id");
  //permisoes
		const podeVer = permissoes.some(permissao => permissao.Permissao.descricao === "VER");
		const podeEditar = permissoes.some(permissao => permissao.Permissao.descricao === "EDITAR");
		const podeDeletar = permissoes.some(permissao => permissao.Permissao.descricao === "DELETAR");
		const podeCriar = permissoes.some(permissao => permissao.Permissao.descricao === "CRIAR");

  // BUSCAR SERVIÇOS NO BACKEND
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

  // FUNÇÃO DE ALTERAR ORDENAÇÃO
  const alterarOrdenacao = (campo) => {
    if (campoOrdenacao === campo) {
      setOrdem(ordem === "asc" ? "desc" : "asc");
    } else {
      setCampoOrdenacao(campo);
      setOrdem("asc");
    }
  };

  // FILTRAGEM
  const servicosFiltrados = servicos.filter(
    (s) =>
      s.id?.toString().includes(pesquisa) ||
      s.nome?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  // ORDENAÇÃO
  const servicosOrdenados = [...servicosFiltrados].sort((a, b) => {
    const campo = campoOrdenacao;

    if (["id", "preco"].includes(campo)) {
      return ordem === "asc"
        ? Number(a[campo]) - Number(b[campo])
        : Number(b[campo]) - Number(a[campo]);
    }

    return ordem === "asc"
      ? a[campo].localeCompare(b[campo])
      : b[campo].localeCompare(a[campo]);
  });

  // PAGINAÇÃO
  const servicosPaginados = servicosOrdenados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // EXCLUIR SERVIÇO
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      await axios.delete(`http://localhost:3002/servicos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
          variant="outlined"
          fullWidth
          margin="normal"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />

        {/* TABELA DE SERVIÇOS */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>

                {/* ID */}
                <TableCell
                  onClick={() => alterarOrdenacao("id")}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  ID {campoOrdenacao === "id" ? (ordem === "asc" ? "▲" : "▼") : ""}
                </TableCell>

                {/* Nome */}
                <TableCell
                  onClick={() => alterarOrdenacao("nome")}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  Nome {campoOrdenacao === "nome" ? (ordem === "asc" ? "▲" : "▼") : ""}
                </TableCell>

                {/* Descrição */}
                <TableCell
                  onClick={() => alterarOrdenacao("descricao")}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  Descrição{" "}
                  {campoOrdenacao === "descricao" ? (ordem === "asc" ? "▲" : "▼") : ""}
                </TableCell>

                {/* Preço */}
                <TableCell
                  onClick={() => alterarOrdenacao("preco")}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  Preço {campoOrdenacao === "preco" ? (ordem === "asc" ? "▲" : "▼") : ""}
                </TableCell>

                <TableCell>
                  <b>Ações</b>
                </TableCell>
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
                          color="secondary"
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

        {/* PAGINAÇÃO */}
        <TablePagination
          component="div"
          count={servicosOrdenados.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Registros por página"
        />

        {/* BOTÃO CRIAR SERVIÇO */}
        {podeCriar && (
          <Stack direction="row-reverse" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => trocarTela("criarServico")}
            >
              Criar Serviço
            </Button>
          </Stack>
        )}
      </Box>
    </div>
  );
}
