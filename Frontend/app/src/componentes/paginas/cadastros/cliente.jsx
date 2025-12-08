import {
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    Divider,
    Snackbar,
    Alert
} from "@mui/material";

import axios from "axios";

// mascara
import {
    mascaraCpfCnpj,
    mascaraTelefone,
    mascaraCEP,
    mascaraData
} from "../../mascara/mascara";

import { useEffect, useState } from "react";

export default function ClienteForm({ clienteId, modo, trocarTela }) {

    const [openMessage, setOpenMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageSeverity, setMessageSeverity] = useState("success");

    const [cliente, setCliente] = useState({
        nome: "",
        cpf_cnpj: "",
        telefone: "",
        email: "",
        cep: "",
        rg: "",
        nascimento: "",
        contribuinte: "",
        inscricao_estadual: ""
    });

    const [erros, setErros] = useState({});

    const token = localStorage.getItem("token");

    // -----------------------------
    // 🟦 Função de mensagem
    // -----------------------------
    const mostrarMensagem = (texto, tipo = "success") => {
        setMessageText(texto);
        setMessageSeverity(tipo);
        setOpenMessage(true);
    };

    // -----------------------------
    // 🟦 Máscaras de input
    // -----------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        let novoValor = value;

        if (name === "cpf_cnpj") novoValor = mascaraCpfCnpj(value);
        if (name === "telefone") novoValor = mascaraTelefone(value);
        if (name === "cep") novoValor = mascaraCEP(value);
        if (name === "nascimento") novoValor = mascaraData(value);

        setCliente({ ...cliente, [name]: novoValor });
    };

    // -----------------------------
    // 🟦 Validação (somente nome e telefone obrigatórios)
    // -----------------------------
    const validar = () => {
        const novosErros = {};

        if (!cliente.nome.trim()) novosErros.nome = "O nome é obrigatório.";
        if (!cliente.telefone.trim()) novosErros.telefone = "O telefone é obrigatório.";

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    // -----------------------------
    // 🟦 Buscar cliente ao editar/ver
    // -----------------------------
    useEffect(() => {
        if (!clienteId) return;

        axios.get(`http://localhost:3002/clientes/${clienteId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setCliente(res.data))
            .catch(err => {
                console.error(err);
                mostrarMensagem("Erro ao carregar dados do cliente!", "error");
            });

    }, [clienteId]);

    // -----------------------------
    // 🟦 Criar / Editar cliente
    // -----------------------------
    const handleSalvar = async () => {
        if (!validar()) {
            mostrarMensagem("Existem erros no formulário!", "error");
            return;
        }

        try {
            if (modo === "criarCliente") {
                await axios.post("http://localhost:3002/clientes", cliente, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                mostrarMensagem("Cliente criado com sucesso!", "success");
            } else {
                await axios.put(`http://localhost:3002/clientes/${clienteId}`, cliente, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                mostrarMensagem("Cliente atualizado!", "success");
            }

            setTimeout(() => trocarTela("clientes"), 800);

        } catch (error) {
            console.log(error);
            mostrarMensagem("Falha ao salvar cliente!", "error");
        }
    };

    const somenteLeitura = modo === "verCliente";

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                {modo === "verCliente" && "Visualizar Cliente"}
                {modo === "editarCliente" && "Editar Cliente"}
                {modo === "criarCliente" && "Criar Novo Cliente"}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
                {[
                    ["Nome", "nome"],
                    ["CPF/CNPJ", "cpf_cnpj"],
                    ["Telefone", "telefone"],
                    ["Email", "email"],
                    ["CEP", "cep"],
                    ["RG", "rg"],
                    ["Nascimento", "nascimento"],
                    ["Contribuinte", "contribuinte"],
                    ["Inscrição Estadual", "inscricao_estadual"],
                ].map(([label, field]) => (

                    <Grid
                        item
                        key={field}
                        sx={{
                            width: { xs: "100%", sm: "50%", md: "33%" }
                        }}
                    >
                        <TextField
                            fullWidth
                            label={label}
                            name={field}
                            value={cliente[field] || ""}
                            onChange={handleChange}
                            disabled={somenteLeitura}
                            error={!!erros[field]}
                            helperText={erros[field]}
                        />
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                <Button variant="outlined" onClick={() => trocarTela("clientes")}>
                    Voltar
                </Button>

                {modo !== "verCliente" && (
                    <Button variant="contained" onClick={handleSalvar}>
                        Salvar
                    </Button>
                )}
            </Box>

            {/* Snackbar de mensagens */}
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
