import React, { useState, useEffect } from "react";
import { Typography, Grid, Paper } from "@mui/material";
import axios from "axios";

export default function Dashboard() {
    const [dados, setDados] = useState({
        total_de_ordens: 0,
        ordensFinalizadas: 0,
    });

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:3002/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setDados(response.data);
        } catch (error) {
            console.error("Erro ao buscar dados do dashboard:", error);
        }
    };

    useEffect(() => {
        fetchDashboard();

        // Atualiza a cada 10 segundos
        const interval = setInterval(fetchDashboard, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="bg_dashboard">
            <Typography className="texto" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3} columns={12}>

                {/* Total de Ordens */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography className="texto">
                            Nº de Ordens de Serviço
                        </Typography>
                        <Typography className="numeros">
                            {dados.total_de_ordens}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Ordens Finalizadas */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography className="texto">
                            Ordens Finalizadas
                        </Typography>
                        <Typography className="numeros">
                            {dados.ordensFinalizadas}
                        </Typography>
                    </Paper>
                </Grid>

            </Grid>
        </div>
    );
}
