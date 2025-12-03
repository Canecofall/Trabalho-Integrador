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

export default function Menu_ini({ trocarTela }) {
    const [open, setOpen] = useState(false);

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {/* Botão para abrir o menu */}
            <IconButton onClick={() => setOpen(true)}>
                <MenuIcon />
            </IconButton>

            {/* Menu retrátil */}
            <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 250 }}>
                    <List>
                        <ListItem
                            button
                            onClick={() => {
                                trocarTela("dashboard");
                                setOpen(false); // fecha o menu
                            }}
                        >
                            <ListItemText primary="Dashboard" />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => {
                                trocarTela("equipamentos");
                                setOpen(false); // fecha o menu
                            }}
                        >
                            <ListItemText primary="Equipamentos armazenados" />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => {
                                trocarTela("ordens");
                                setOpen(false); // fecha o menu
                            }}
                        >
                            <ListItemText primary="Ordens de serviço" />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => {
                                trocarTela("servicos");
                                setOpen(false); // fecha o menu
                            }}
                        >
                            <ListItemText primary="Serviços" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}
