const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

// Controllers (rotas)
const usuarioPermissaoRouter = require("./controllers/usuario_permissao-controller");
const usuarioRouter = require("./controllers/usuario-controller");
const permissaoRouter = require("./controllers/permissao-controller");
const authRouter = require("./controllers/auth-controller");
const servicoController = require("./controllers/servico-controller");
const clienteController = require("./controllers/cliente-controller");
const ordemServicoController = require("./controllers/ordem_de_servico-controler");
const dashboardController = require("./controllers/dashboard-controller");

// Services
const authService = require("./services/auth-service");

const app = express();
app.use(cors());
app.use(express.json());

// Configurar sessão ANTES do passport
app.use(
    session({
        secret: "alguma_frase_muito_doida_pra_servir_de_SECRET",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // HTTP normal (não HTTPS)
    })
);

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar estratégias do Passport
authService.configureLocalStrategy();
authService.configureJwtStrategy();
authService.configureSerialization();

// ROTAS
app.use("/", authRouter);
app.use("/usuario_permissao", usuarioPermissaoRouter);
app.use("/usuario", usuarioRouter);
app.use("/permissao", permissaoRouter);
app.use("/servicos", servicoController);
app.use("/clientes", clienteController);
app.use("/ordens", ordemServicoController);
app.use("/dashboard", dashboardController);


// INICIAR SERVIDOR *DEPOIS* de registrar as rotas
const PORT = 3002;
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}.`));