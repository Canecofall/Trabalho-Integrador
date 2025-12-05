import React, { useState, useEffect } from "react";
import {
    Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Stack, TablePagination, Select, MenuItem,
} from "@mui/material";
import "@/componentes/tema/Style.css"

export default function EquipamentosCatalogo({ trocarTela, permissoes = [] }) {
    const [ordens, setOrdens] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
const podeVer = permissoes.includes("VER");
const podeEditar = permissoes.includes("EDITAR");
const podeDeletar = permissoes.includes("DELETAR");
const podeCriar = permissoes.includes("CRIAR");

    useEffect(() => {
        // Mock temporário
        setOrdens([
            { id: 1, cliente: "João Silva", equipamento: "Notebook Dell", status: "Finalizada" },
            { id: 2, cliente: "Maria Souza", equipamento: "Impressora HP", status: "Em andamento" },
            { id: 3, cliente: "Carlos Lima", equipamento: "Servidor IBM", status: "Pendente" },
        ]);
    }, []);

    // Filtra ordens pela pesquisa
    const ordensFiltradas = ordens.filter(
        (ordem) =>
            ordem.id.toString().includes(pesquisa) ||
            ordem.cliente.toLowerCase().includes(pesquisa.toLowerCase())
    );

    // Dados paginados
    const ordensPaginadas = ordensFiltradas.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Função para alterar status
    const handleStatusChange = (id, novoStatus) => {
        setOrdens((prev) =>
            prev.map((ordem) =>
                ordem.id === id ? { ...ordem, status: novoStatus } : ordem
            )
        );
        // Aqui você poderia chamar o backend para atualizar:
        // axios.put(`http://localhost:3002/ordens/${id}`, { status: novoStatus })
    };

    const handleDelete = (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta ordem de serviço?")) {
            // Se for mock:
            setOrdens(ordens.filter((ordem) => ordem.id !== id));

            // Se for backend:
            // axios.delete(`http://localhost:3002/ordens/${id}`)
            //   .then(() => setOrdens(ordens.filter((ordem) => ordem.id !== id)))
            //   .catch(err => console.error(err));
        }
    };

    return (
        <div id="bg">
            <Box sx={{ p: 3 }}>
            {/* Barra de pesquisa */}
            <TextField
                label="Pesquisar por Nº Ordem ou Cliente"
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
                            <TableCell>Nº Ordem</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Equipamento</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ordensPaginadas.map((ordem) => (
                            <TableRow key={ordem.id}>
                                <TableCell>{ordem.id}</TableCell>
                                <TableCell>{ordem.cliente}</TableCell>
                                <TableCell>{ordem.equipamento}</TableCell>
                                <TableCell>
                                    <Select
                                        value={ordem.status}
                                        onChange={(e) => handleStatusChange(ordem.id, e.target.value)}
                                        size="small"
                                    >
                                        <MenuItem value="Finalizada">Finalizada</MenuItem>
                                        <MenuItem value="Em andamento">Em andamento</MenuItem>
                                        <MenuItem value="Pendente">Pendente</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        {podeVer && (
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => trocarTela("verOrdem", ordem.id)}
                                            >
                                                Ver
                                            </Button>
                                        )}

                                        {podeEditar && (
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                onClick={() => trocarTela("editarOrdem", ordem.id)}
                                            >
                                                Editar
                                            </Button>
                                        )}

                                        {podeDeletar && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDelete(ordem.id)}
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

            {/* Paginação */}
            <TablePagination
                component="div"
                count={ordensFiltradas.length}
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
            {/* Botão para criar novo serviço */}
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
