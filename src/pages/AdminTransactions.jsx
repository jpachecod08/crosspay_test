import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Paper,
  Button,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import api, { setAuthToken } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminTransactions() {
  const nav = useNavigate();
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/admin/login");
      return;
    }
    setAuthToken(token);

    const delay = new Promise((resolve) => setTimeout(resolve, 1500));

    Promise.all([fetchTxs(), delay])
      .then(() => {
        if (active) setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false; // ✅ evita actualizar estado tras desmontar
    };
  }, []);

  async function fetchTxs() {
    try {
      const res = await api.get("transactions/");
      setTxs(res.data);
      return res; // ✅ devolvemos la promesa para usar en Promise.all
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        nav("/admin/login");
      }
      throw err; // ✅ dejamos que Promise.all maneje el error
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #1976d2 30%, #42a5f5 90%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 6,
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 3,
          borderRadius: 4,
          maxWidth: 1000,
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="primary">
            Transacciones
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              localStorage.removeItem("token");
              nav("/admin/login");
            }}
          >
            Cerrar sesión
          </Button>
        </Toolbar>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <CircularProgress size={50} />
          </Box>
        ) : txs.length > 0 ? (
          <Table>
            <TableHead sx={{ backgroundColor: "primary.main" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Divisa
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Monto
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Descripción
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Tipo documento
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Fecha
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {txs.map((tx) => (
                <TableRow key={tx.id} hover>
                  <TableCell>{tx.currency}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell>{tx.payer_name}</TableCell>
                  <TableCell>{tx.document_type}</TableCell>
                  <TableCell>
                    {new Date(tx.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            No hay transacciones registradas.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
