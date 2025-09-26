import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";          // 👈 ajusta la ruta según tu estructura
import AdminTransactions from "./pages/AdminTransactions";
import PaymentForm from "./pages/PaymentForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta inicial: formulario de pago */}
        <Route path="/" element={<PaymentForm />} />

        {/* Admin: login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin: transacciones */}
        <Route path="/admin/transactions" element={<AdminTransactions />} />

        {/* Redirección para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
