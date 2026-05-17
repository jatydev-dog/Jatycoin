const express = require('express');
const app = express();

// Middleware para leer JSON (importante para después con Stripe/Zapier)
app.use(express.json());

// 🔹 Ruta base (para comprobar que funciona)
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Jatycoin backend activo'
  });
});

// 🔹 Endpoint de prueba (vesting)
app.get('/create-vesting', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Endpoint create-vesting funcionando'
  });
});

// 🔹 Puerto Railway
const PORT = process.env.PORT || 8080;

// 🔹 Arranque servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
