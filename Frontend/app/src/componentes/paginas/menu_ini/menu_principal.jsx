import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemText,
  IconButton,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "@/componentes/tema/Style.css";

export default function Menu_ini({ trocarTela, onLogout }) {
  const [open, setOpen] = useState(false);

  const navegar = (tela) => {
    trocarTela(tela);
    setOpen(false);
  };

  return (
    <Box id="bg" sx={{ flexGrow: 1, p: 3 }}>
      <IconButton onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250 }}>
          <List>

            {/* DASHBOARD */}
            <ListItemButton onClick={() => navegar("dashboard")}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            {/* CLIENTES */}
            <ListItemButton onClick={() => navegar("clientes")}>
              <ListItemText primary="Clientes" />
            </ListItemButton>

            {/* ORDENS */}
            <ListItemButton onClick={() => navegar("ordens")}>
              <ListItemText primary="Ordens de Serviço" />
            </ListItemButton>

            {/* SERVIÇOS */}
            <ListItemButton onClick={() => navegar("servicos")}>
              <ListItemText primary="Serviços" />
            </ListItemButton>

            {/* LOGOUT */}
            <ListItemButton
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>

          </List>
        </Box>
      </Drawer>
    </Box>
  );
}