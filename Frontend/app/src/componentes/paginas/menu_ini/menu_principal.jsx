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
import "@/componentes/tema/Style.css"

export default function Menu_ini({ trocarTela, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <Box id="bg" sx={{ flexGrow: 1, p: 3 }}>
      <IconButton onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250 }}>
          <List>
            <ListItemButton
              onClick={() => {
                trocarTela("dashboard");
                setOpen(false);
              }}
            >
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            <ListItemButton
              onClick={() => {
                trocarTela("equipamentos");
                setOpen(false);
              }}
            >
              <ListItemText primary="Equipamentos armazenados" />
            </ListItemButton>

            <ListItemButton
              onClick={() => {
                trocarTela("ordens");
                setOpen(false);
              }}
            >
              <ListItemText primary="Ordens de serviço" />
            </ListItemButton>

            <ListItemButton
              onClick={() => {
                trocarTela("servicos");
                setOpen(false);
              }}
            >
              <ListItemText primary="Serviços" />
            </ListItemButton>

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