const express = require("express");
const dashboardRouter = express.Router();
const dashboardService = require("../services/dashboard-service");
const authService = require("../services/auth-service");

dashboardRouter.get(
    "/",
    authService.requireJWTAuth,
    authService.verificarPermissaoMiddleware("VER"), 
    async (req, res) => {
        try {
            const dados = await dashboardService.getDashboardData();
            res.json(dados);
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    }
);

module.exports = dashboardRouter;
