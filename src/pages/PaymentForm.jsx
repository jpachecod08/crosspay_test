import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ usamos location
import api from "../api/axios";
import CrossPayLogo from "../assets/crosspay.svg";

export default function PaymentForm() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ ruta actual

  const [form, setForm] = useState({
    currency: "COP",
    amount: "",
    description: "",
    payer_name: "",
    document_type: "Cedula",
    document_number: "",
    card_number: "",
    card_expiry: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const delay = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const payload = { ...form };
      await Promise.all([api.post("transactions/", payload), delay]);
      setMsg({ type: "success", text: "Transacción registrada correctamente" });

      setForm({
        currency: "COP",
        amount: "",
        description: "",
        payer_name: "",
        document_type: "Cedula",
        document_number: "",
        card_number: "",
        card_expiry: "",
        cvv: "",
      });
    } catch (err) {
      console.error("Error:", err);
      setMsg({
        type: "error",
        text: err.response?.data?.error || "Error registrando la transacción",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #42a5f5 20%, #e3f2fd 90%)",
        display: "flex",
        flexDirection: "column",
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
              onClick={() => navigate("/")}
            />
          </Box>

          <Box>
            <Button
              color="inherit"
              onClick={() => navigate("/")}
              disabled={location.pathname === "/"}
              sx={{
                opacity: location.pathname === "/" ? 0.5 : 1,
              }}
            >
              Formulario
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/admin/login")}
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
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 500,
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            mb={4}
            textAlign="center"
            fontWeight="bold"
            color="primary"
          >
            Formulario de pago
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              select
              label="Divisa"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="COP">COP</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
            </TextField>

            <TextField
              label="Monto"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
              inputProps={{ step: "0.01" }}
            />

            <TextField
              label="Descripción"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Nombre"
              name="payer_name"
              value={form.payer_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              select
              label="Tipo documento"
              name="document_type"
              value={form.document_type}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Cedula">Cédula</MenuItem>
              <MenuItem value="Pasaporte">Pasaporte</MenuItem>
            </TextField>

            <TextField
              label="Número de documento"
              name="document_number"
              value={form.document_number}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Número de tarjeta"
              name="card_number"
              value={form.card_number}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                label="Fecha expiración (MM/YY)"
                name="card_expiry"
                value={form.card_expiry}
                onChange={handleChange}
                fullWidth
                margin="normal"
                placeholder="MM/YY"
              />
              <TextField
                label="CVV"
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="password"
              />
            </Box>

            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              fullWidth
              sx={{ mt: 4, py: 1.5, fontWeight: "bold", fontSize: "1.1rem" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Pagar"
              )}
            </Button>
          </Box>

          <Snackbar
            open={!!msg}
            autoHideDuration={5000}
            onClose={() => setMsg(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            {msg && (
              <Alert severity={msg.type} onClose={() => setMsg(null)}>
                {msg.text}
              </Alert>
            )}
          </Snackbar>
        </Paper>
      </Box>
    </Box>
  );
}
