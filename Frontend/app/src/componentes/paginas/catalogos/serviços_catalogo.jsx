import React, { useState, useEffect } from "react";
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
import { ThemeProvider, createTheme } from "@mui/material/styles";
// Mock de serviços
const mockServicos = [
  { id: 1, nome: "Formatação de Notebook", preco: 150 },
  { id: 2, nome: "Troca de HD para SSD", preco: 300 },
  { id: 3, nome: "Limpeza interna e troca de pasta térmica", preco: 120 },
];

export default function serviços_catalogo({ trocarTela, permissoes = [] }) {
  const [servicos, setServicos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const podeVer = permissoes.includes("VER");
  const podeEditar = permissoes.includes("EDITAR");
  const podeDeletar = permissoes.includes("DELETAR");
  const podeCriar = permissoes.includes("CRIAR");
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
});
 const servicosFiltrados = servicos.filter(
  (s) =>
    s.id.toString().includes(pesquisa) ||
    s.nome.toLowerCase().includes(pesquisa.toLowerCase())
);


  useEffect(() => {
    // Carregar mock
    setServicos(mockServicos);
  }, []);

  // Dados paginados
  const servicosPaginados = servicosFiltrados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      // Se for mock:
      setServicos(servicos.filter((s) => s.id !== id));

      // Se for backend:
      // axios.delete(`http://localhost:3002/servicos/${id}`)
      //   .then(() => setServicos(servicos.filter((s) => s.id !== id)))
      //   .catch(err => console.error(err));
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicosPaginados.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.nome}</TableCell>
                  <TableCell>R$ {s.preco}</TableCell>
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

        <TablePagination
          component="div"
          count={servicosFiltrados.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Registros por página"
        />

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