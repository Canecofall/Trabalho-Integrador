import React, { useState, useEffect } from "react";
import {
  Box,
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
  Typography,
} from "@mui/material";

// Mock de serviços
const mockServicos = [
  { id: 1, nome: "Formatação de Notebook", preco: 150 },
  { id: 2, nome: "Troca de HD para SSD", preco: 300 },
  { id: 3, nome: "Limpeza interna e troca de pasta térmica", preco: 120 },
];

export default function servico_catalogo({ trocarTela }) {
  const [servicos, setServicos] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Carregar mock
    setServicos(mockServicos);
  }, []);

  // Dados paginados
  const servicosPaginados = servicos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Catálogo de Serviços
      </Typography>

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
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => trocarTela("verServico", s.id)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => trocarTela("editarServico", s.id)}
                    >
                      Editar
                    </Button>

                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginação */}
      <TablePagination
        component="div"
        count={servicos.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Registros por página"
      />

      {/* Botão para criar novo serviço */}
      <Stack direction="row-reverse" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => trocarTela("criarServico")}
        >
          Criar Serviço
        </Button>
      </Stack>
    </Box>
  );
}
