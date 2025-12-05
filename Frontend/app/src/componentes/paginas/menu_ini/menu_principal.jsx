import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
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
            <ListItem
              button
              onClick={() => {
                trocarTela("dashboard");
                setOpen(false);
              }}
            >
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                trocarTela("equipamentos");
                setOpen(false);
              }}
            >
              <ListItemText primary="Equipamentos armazenados" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                trocarTela("ordens");
                setOpen(false);
              }}
            >
              <ListItemText primary="Ordens de serviço" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                trocarTela("servicos");
                setOpen(false);
              }}
            >
              <ListItemText primary="Serviços" />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
