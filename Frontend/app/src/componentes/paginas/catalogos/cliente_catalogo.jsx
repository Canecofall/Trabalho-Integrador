import React, { useEffect, useState } from "react";
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
import axios from "axios";

export default function ClientesCatalogo({ trocarTela, permissoes = [] }) {

    const [clientes, setClientes] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [campoOrdenacao, setCampoOrdenacao] = useState("nome");
    const [ordem, setOrdem] = useState("asc");

    const podeVer = permissoes.some(p => p.Permissao.descricao === "VER");
    const podeEditar = permissoes.some(p => p.Permissao.descricao === "EDITAR");
    const podeDeletar = permissoes.some(p => p.Permissao.descricao === "DELETAR");
    const podeCriar = permissoes.some(p => p.Permissao.descricao === "CRIAR");

    const token = localStorage.getItem("token");

    const carregarClientes = async () => {
        try {
            const res = await axios.get("http://localhost:3002/clientes", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClientes(res.data);
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
            alert("Erro ao buscar clientes.");
        }
    };

    useEffect(() => {
        carregarClientes();
    }, []);

    // 🔽 Alternar ordenação igual ao catálogo de ordens
    const alterarOrdenacao = (campo) => {
        if (campoOrdenacao === campo) {
            setOrdem(ordem === "asc" ? "desc" : "asc");
        } else {
            setCampoOrdenacao(campo);
            setOrdem("asc");
        }
    };

    // 🔽 Aplicar filtro
    const clientesFiltrados = clientes.filter(c =>
        c.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        c.cpf_cnpj.includes(pesquisa)
    );

    // 🔽 Ordenação
    const clientesOrdenados = [...clientesFiltrados].sort((a, b) => {
        const campo = campoOrdenacao;

        let v1 = a[campo] ?? "";
        let v2 = b[campo] ?? "";

        v1 = String(v1).toLowerCase();
        v2 = String(v2).toLowerCase();

        return ordem === "asc" ? v1.localeCompare(v2) : v2.localeCompare(v1);
    });

    // Paginação
    const clientesPaginados = clientesOrdenados.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

        try {
            await axios.delete(`http://localhost:3002/clientes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setClientes((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
            console.error("Erro ao deletar cliente:", error);
            alert("Não foi possível deletar o cliente.");
        }
    };

    const seta = (campo) =>
        campoOrdenacao === campo ? (ordem === "asc" ? " ▲" : " ▼") : "";

    return (
        <Box sx={{ p: 3 }}>

            <TextField
                label="Pesquisar por nome ou CPF/CNPJ"
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
                                onClick={() => alterarOrdenacao("nome")}
                                style={{ cursor: "pointer", fontWeight: "bold" }}
                            >
                                Nome {seta("nome")}
                            </TableCell>

                            <TableCell
                                onClick={() => alterarOrdenacao("cpf_cnpj")}
                                style={{ cursor: "pointer", fontWeight: "bold" }}
                            >
                                CPF/CNPJ {seta("cpf_cnpj")}
                            </TableCell>

                            <TableCell
                                onClick={() => alterarOrdenacao("telefone")}
                                style={{ cursor: "pointer", fontWeight: "bold" }}
                            >
                                Telefone {seta("telefone")}
                            </TableCell>

                            <TableCell
                                onClick={() => alterarOrdenacao("email")}
                                style={{ cursor: "pointer", fontWeight: "bold" }}
                            >
                                Email {seta("email")}
                            </TableCell>

                            <TableCell><b>Ações</b></TableCell>

                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {clientesPaginados.map(c => (
                            <TableRow key={c.id}>
                                <TableCell>{c.nome}</TableCell>
                                <TableCell>{c.cpf_cnpj}</TableCell>
                                <TableCell>{c.telefone}</TableCell>
                                <TableCell>{c.email}</TableCell>

                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        {podeVer && (
                                            <Button
                                                variant="outlined"
                                                onClick={() => trocarTela("verCliente", c.id)}
                                            >
                                                Ver
                                            </Button>
                                        )}

                                        {podeEditar && (
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                onClick={() => trocarTela("editarCliente", c.id)}
                                            >
                                                Editar
                                            </Button>
                                        )}

                                        {podeDeletar && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDelete(c.id)}
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
                count={clientesOrdenados.length}
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
                    <Button variant="contained" onClick={() => trocarTela("criarCliente")}>
                        Criar Cliente
                    </Button>
                </Stack>
            )}
        </Box>
    );
}
