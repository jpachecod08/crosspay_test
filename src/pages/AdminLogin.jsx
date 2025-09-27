import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Lock } from "@mui/icons-material";
import api, { setAuthToken } from "../api/axios"; // Asegúrate de que tu archivo api/axios sea correcto
import CrossPayLogo from "../assets/crosspay.svg"; // Asegúrate de que la ruta de la imagen sea correcta
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminLogin() {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("auth/login/", creds);
      const token = res.data.token;
      localStorage.setItem("token", token);
      setAuthToken(token);
      
      // 🔥 SOLUCIÓN FINAL AL ERROR 'removeChild':
      // Introducir un pequeño retraso (100ms) para que el estado de 'loading'
      // se actualice y el DOM se estabilice antes de iniciar la navegación.
      await new Promise(resolve => setTimeout(resolve, 100));

      // Mantenemos { replace: true } ya que es la mejor práctica después del login.
      nav("/admin/transactions", { replace: true });

    } catch (err) {
      // Usamos console.error para no depender de alert()
      console.error("Login fallido:", err); 
      // Aquí deberías usar un componente Snackbar o un modal, no alert()
      alert("Credenciales inválidas"); 
    } finally {
      // Aseguramos que loading se desactive, aunque la navegación ya se inició
      setLoading(false); 
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #1976d2 30%, #42a5f5 90%)",
      }}
    >
      {/* 🔹 NAVBAR */}
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={CrossPayLogo}
              alt="CrossPay Logo"
              style={{ height: "40px", cursor: "pointer" }}
              onClick={() => nav("/")}
            />
          </Box>

          <Box>
            <Button
              color="inherit"
              onClick={() => nav("/")}
              disabled={location.pathname === "/"}
              sx={{
                opacity: location.pathname === "/" ? 0.5 : 1,
              }}
            >
              Formulario
            </Button>
            <Button
              color="inherit"
              onClick={() => nav("/admin/login")}
              disabled={location.pathname === "/admin/login"}
              sx={{
                opacity: location.pathname === "/admin/login" ? 0.5 : 1,
              }}
            >
              Portal Administrativo
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 🔹 CONTENIDO */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 4,
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              mb: 2,
              mx: "auto",
              width: 56,
              height: 56,
            }}
          >
            <Lock fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Portal Administrativo
          </Typography>

          <Box component="form" onSubmit={submit}>
            <TextField
              label="Usuario"
              name="username"
              value={creds.username}
              onChange={(e) => setCreds({ ...creds, username: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contraseña"
              type="password"
              name="password"
              value={creds.password}
              onChange={(e) =>
                setCreds({ ...creds, password: e.target.value })
              }
              fullWidth
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.4,
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: 2,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Ingresar"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}