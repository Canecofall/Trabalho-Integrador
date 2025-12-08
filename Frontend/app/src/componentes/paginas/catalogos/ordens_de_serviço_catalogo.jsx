import React, { useState, useEffect } from "react";
import {
    Box, TextField, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Stack, TablePagination,
    Select, MenuItem
} from "@mui/material";
import axios from "axios";
import "@/componentes/tema/Style.css";

export default function OrdensDeServicoCatalogo({ trocarTela, permissoes = [] }) {

    const [ordens, setOrdens] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Ordenação
    const [campoOrdenacao, setCampoOrdenacao] = useState("id");
    const [ordem, setOrdem] = useState("asc");

    // Permissões
    const podeVer = permissoes.some(p => p.Permissao.descricao === "VER");
    const podeEditar = permissoes.some(p => p.Permissao.descricao === "EDITAR");
    const podeDeletar = permissoes.some(p => p.Permissao.descricao === "DELETAR");
    const podeCriar = permissoes.some(p => p.Permissao.descricao === "CRIAR");

    // Buscar ordens
    const carregarOrdens = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:3002/ordens", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOrdens(res.data);
        } catch (error) {
            console.error("Erro ao buscar ordens:", error);
            alert("Erro ao carregar ordens de serviço.");
        }
    };

    useEffect(() => {
        carregarOrdens();
    }, []);

    //  Alterar campo de ordenação
    const alterarOrdenacao = (campo) => {
        if (campoOrdenacao === campo) {
            setOrdem(ordem === "asc" ? "desc" : "asc");
        } else {
            setCampoOrdenacao(campo);
            setOrdem("asc");
        }
    };

    // Filtrar ordens
    const ordensFiltradas = ordens.filter((ordem) =>
        ordem.id.toString().includes(pesquisa) ||
        (ordem.cliente?.nome || "").toLowerCase().includes(pesquisa.toLowerCase())
    );

    // Ordenar ordens
    const ordensOrdenadas = [...ordensFiltradas].sort((a, b) => {
        const campo = campoOrdenacao;

        let v1 = a[campo];
        let v2 = b[campo];

        // cliente.nome
        if (campo === "cliente") {
            v1 = a.cliente?.nome || "";
            v2 = b.cliente?.nome || "";
        }

        // Comparação numérica
        if (campo === "id") {
            return ordem === "asc" ? v1 - v2 : v2 - v1;
        }

        // Comparação textual
        return ordem === "asc"
            ? String(v1).localeCompare(String(v2))
            : String(v2).localeCompare(String(v1));
    });

    // Paginação
    const ordensPaginadas = ordensOrdenadas.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Atualizar status
    const handleStatusChange = async (id, novoStatus) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:3002/ordens/${id}`,
                { status: novoStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOrdens(prev =>
                prev.map((ordem) => ordem.id === id ? { ...ordem, status: novoStatus } : ordem)
            );

        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Erro ao atualizar status da ordem.");
        }
    };

    // Deletar ordem
    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir esta OS?")) return;

        try {
            const token = localStorage.getItem("token");

            await axios.delete(`http://localhost:3002/ordens/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOrdens(ordens.filter((ordem) => ordem.id !== id));

        } catch (error) {
            console.error("Erro ao deletar ordem:", error);
            alert("Não foi possível deletar.");
        }
    };

    return (
        <div id="bg">
            <Box sx={{ p: 3 }}>

                <TextField
                    label="Pesquisar por Nº Ordem ou Cliente"
                    fullWidth
                    margin="normal"
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                />

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>

                                {/* Nº da Ordem */}
                                <TableCell
                                    onClick={() => alterarOrdenacao("id")}
                                    style={{ cursor: "pointer", fontWeight: "bold" }}
                                >
                                    Nº Ordem {campoOrdenacao === "id" ? (ordem === "asc" ? "▲" : "▼") : ""}
                                </TableCell>

                                {/* Cliente */}
                                <TableCell
                                    onClick={() => alterarOrdenacao("cliente")}
                                    style={{ cursor: "pointer", fontWeight: "bold" }}
                                >
                                    Cliente {campoOrdenacao === "cliente" ? (ordem === "asc" ? "▲" : "▼") : ""}
                                </TableCell>

                                {/* Equipamento */}
                                <TableCell
                                    onClick={() => alterarOrdenacao("equipamento")}
                                    style={{ cursor: "pointer", fontWeight: "bold" }}
                                >
                                    Equipamento {campoOrdenacao === "equipamento" ? (ordem === "asc" ? "▲" : "▼") : ""}
                                </TableCell>

                                {/* Status */}
                                <TableCell
                                    onClick={() => alterarOrdenacao("status")}
                                    style={{ cursor: "pointer", fontWeight: "bold" }}
                                >
                                    Status {campoOrdenacao === "status" ? (ordem === "asc" ? "▲" : "▼") : ""}
                                </TableCell>

                                <TableCell><b>Ações</b></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {ordensPaginadas.map((ordem) => (
                                <TableRow key={ordem.id}>

                                    <TableCell>{ordem.id}</TableCell>
                                    <TableCell>{ordem.cliente?.nome || "—"}</TableCell>
                                    <TableCell>{ordem.equipamento}</TableCell>

                                    <TableCell>
                                        <Select
                                            value={ordem.status}
                                            onChange={(e) =>
                                                handleStatusChange(ordem.id, e.target.value)
                                            }
                                            size="small"
                                            disabled={!podeEditar}
                                        >
                                            <MenuItem value="ABERTA">ABERTA</MenuItem>
                                            <MenuItem value="EM ANDAMENTO">EM ANDAMENTO</MenuItem>
                                            <MenuItem value="FINALIZADA">FINALIZADA</MenuItem>
                                            <MenuItem value="CANCELADA">CANCELADA</MenuItem>
                                        </Select>
                                    </TableCell>

                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            {podeVer && (
                                                <Button
                                                    variant="outlined"
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

                <TablePagination
                    component="div"
                    count={ordensOrdenadas.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                />

                {podeCriar && (
                    <Stack direction="row-reverse" sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => trocarTela("criarOrdem")}
                        >
                            Criar Ordem
                        </Button>
                    </Stack>
                )}

            </Box>
        </div>
    );
}
