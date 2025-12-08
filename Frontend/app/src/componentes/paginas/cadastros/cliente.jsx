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

// Máscaras
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

    // Função de mensagem
    const mostrarMensagem = (texto, tipo = "success") => {
        setMessageText(texto);
        setMessageSeverity(tipo);
        setOpenMessage(true);
    };

    // Converte DD/MM/AAAA → AAAA-MM-DD para o banco
    const converterDataParaISO = (dataBR) => {
        if (!dataBR) return null;

        const partes = dataBR.split("/");
        if (partes.length !== 3) return null;

        const [dia, mes, ano] = partes;
        return `${ano}-${mes}-${dia}`;
    };

    // Máscaras
    const handleChange = (e) => {
        const { name, value } = e.target;
        let novoValor = value;

        if (name === "cpf_cnpj") novoValor = mascaraCpfCnpj(value);
        if (name === "telefone") novoValor = mascaraTelefone(value);
        if (name === "cep") novoValor = mascaraCEP(value);
        if (name === "nascimento") novoValor = mascaraData(value);

        setCliente({ ...cliente, [name]: novoValor });
    };

    // Validação
    const validar = () => {
        const errosTemp = {};

        // Nome
        if (!cliente.nome || !cliente.nome.trim()) {
            errosTemp.nome = "O nome é obrigatório.";
        }

        // Telefone
        const telLimpo = (cliente.telefone || "").replace(/\D/g, "");
        if (!telLimpo) {
            errosTemp.telefone = "O telefone é obrigatório.";
        } else if (telLimpo.length < 10 || telLimpo.length > 11) {
            errosTemp.telefone = "Telefone inválido.";
        }

        // CPF/CNPJ
        const doc = (cliente.cpf_cnpj || "").replace(/\D/g, "");
        if ((cliente.cpf_cnpj || "").trim()) {
            if (doc.length !== 11 && doc.length !== 14) {
                errosTemp.cpf_cnpj = "CPF/CNPJ inválido.";
            }
        }

        // CEP
        const cepLimpo = (cliente.cep || "").replace(/\D/g, "");
        if ((cliente.cep || "").trim() && cepLimpo.length !== 8) {
            errosTemp.cep = "CEP inválido.";
        }

        // RG
        const rgLimpo = (cliente.rg || "").replace(/\D/g, "");
        if ((cliente.rg || "").trim() && (rgLimpo.length < 5 || rgLimpo.length > 14)) {
            errosTemp.rg = "RG inválido.";
        }

        // Nascimento
        const nascimentoStr = (cliente.nascimento || "").trim();

        if (nascimentoStr) {
            const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;

            if (!regexData.test(nascimentoStr)) {
                errosTemp.nascimento = "Data inválida. Use DD/MM/AAAA.";
            } else {
                const [dia, mes, ano] = nascimentoStr.split("/").map(Number);
                const dataObj = new Date(ano, mes - 1, dia);

                if (
                    dataObj.getFullYear() !== ano ||
                    dataObj.getMonth() !== mes - 1 ||
                    dataObj.getDate() !== dia
                ) {
                    errosTemp.nascimento = "Data inexistente!";
                }
            }
        }

        setErros(errosTemp);
        return Object.keys(errosTemp).length === 0;
    };

    // Buscar cliente
    useEffect(() => {
        if (!clienteId) return;

        axios
            .get(`http://localhost:3002/clientes/${clienteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                // converter data ISO → BR para exibir no formulário
                const clienteBD = res.data;
                if (clienteBD.nascimento) {
                    const [ano, mes, dia] = clienteBD.nascimento.split("-");
                    clienteBD.nascimento = `${dia}/${mes}/${ano}`;
                }

                setCliente(clienteBD);
            })
            .catch(err => {
                console.error(err);
                mostrarMensagem("Erro ao carregar dados do cliente!", "error");
            });

    }, [clienteId]);

    // Salvar
    const handleSalvar = async () => {
        if (!validar()) {
            mostrarMensagem("Existem erros no formulário!", "error");
            return;
        }

        const dadosParaEnviar = {
            ...cliente,
            nascimento: converterDataParaISO(cliente.nascimento)
        };

        try {
            if (modo === "criarCliente") {
                await axios.post("http://localhost:3002/clientes", dadosParaEnviar, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                mostrarMensagem("Cliente criado com sucesso!", "success");
            } else {
                await axios.put(`http://localhost:3002/clientes/${clienteId}`, dadosParaEnviar, {
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
                        key={field}
                        sx={{ width: { xs: "100%", sm: "50%", md: "33%" } }}
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

            {/* Snackbar */}
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
