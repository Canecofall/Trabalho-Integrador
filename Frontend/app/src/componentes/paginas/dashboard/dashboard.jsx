import React, { useState, useEffect } from "react";
import { Typography, Grid, Paper } from "@mui/material";
import axios from "axios";

export default function Dashboard() {
    const [dados, setDados] = useState({
        total_de_ordens: 0,
        ordensFinalizadas: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 📌 Quando o backend estiver pronto, use:
                // const response = await axios.get("http://localhost:3002/dashboard", {
                //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                // });
                // setDados(response.data);

                // Mock temporário para testes:
                setDados({
                    total_de_ordens: 0,
                    ordensFinalizadas: 0,
                });

            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="bg_dashboard">
            <Typography className="texto" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3} columns={12}>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography className="texto">Nº de Ordens de Serviço</Typography>
                        <Typography className="numeros">{dados.total_de_ordens}</Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography className="texto">Ordens Finalizadas</Typography>
                        <Typography className="numeros">{dados.ordensFinalizadas}</Typography>
                    </Paper>
                </Grid>

            </Grid>


        </div>
    );
}
