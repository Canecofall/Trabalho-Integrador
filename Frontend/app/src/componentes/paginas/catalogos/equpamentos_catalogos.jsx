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

export default function EquipamentosCatalogo({ trocarTela }) {
  const [equipamentos, setEquipamentos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    // Mock temporário
    setEquipamentos([
      { id: 1, cliente: "João Silva", equipamento: "Notebook Dell", modelo: "Inspiron 15" },
      { id: 2, cliente: "Maria Souza", equipamento: "Impressora HP", modelo: "Deskjet 2136" },
      { id: 3, cliente: "Carlos Lima", equipamento: "Servidor IBM", modelo: "X3650" },
    ]);
  }, []);

  // Filtra equipamentos pela pesquisa
  const equipamentosFiltrados = equipamentos.filter(
    (eq) =>
      eq.id.toString().includes(pesquisa) ||
      eq.cliente.toLowerCase().includes(pesquisa.toLowerCase()) ||
      eq.equipamento.toLowerCase().includes(pesquisa.toLowerCase())
  );

  // Dados paginados
  const equipamentosPaginados = equipamentosFiltrados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Barra de pesquisa */}
      <TextField
        label="Pesquisar por Nº ou Cliente/Equipamento"
        variant="outlined"
        fullWidth
        margin="normal"
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nº</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Equipamento</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipamentosPaginados.map((eq) => (
              <TableRow key={eq.id}>
                <TableCell>{eq.id}</TableCell>
                <TableCell>{eq.cliente}</TableCell>
                <TableCell>{eq.equipamento}</TableCell>
                <TableCell>{eq.modelo}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => trocarTela("verEquipamento", eq.id)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => trocarTela("editarEquipamento", eq.id)}
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
        count={equipamentosFiltrados.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Registros por página"
      />

      {/* Botões de ação */}
      <Stack direction="row-reverse" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => trocarTela("criarEquipamento")}
        >
          Cadastrar Equipamento
        </Button>
      </Stack>
    </Box>
  );
}
