import React, { useState, useEffect } from "react";
import {
    Typography,
    Grid,
    Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";

export default function Dashboard() {

    const [dados, setDados] = useState({
        usuariosAtivos: 0,
        ordensFinalizadas: 0,
    });

    // Atualização dinâmica
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await axios.get("http://localhost:3002/dashboard");
                // setDados(response.data);

                // Mock temporário para testes
                setDados({
                    usuariosAtivos: 0,
                    ordensFinalizadas: 0,
                    produtos: 0,
                });
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();

        // Atualiza a cada 10 segundos
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Typography class="texto" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography class="texto">Usuários Ativos</Typography>
                        <Typography class="numeros">{dados.usuariosAtivos}</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography class="texto">Ordens Finalizadas</Typography>
                        <Typography class="numeros">{dados.ordensFinalizadas}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}


