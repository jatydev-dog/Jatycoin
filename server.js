const express = require('express');
const app = express();

// 🔹 Middleware para leer JSON (necesario para Zapier)
app.use(express.json());

// 🔹 Ruta base (comprobación)
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Jatycoin backend activo'
  });
});

// 🔹 Endpoint REAL (recibe datos desde Zapier)
app.post('/create-vesting', (req, res) => {
  const { wallet, amount, email } = req.body;

  console.log('--- NUEVO VESTING ---');
  console.log('Wallet:', wallet);
  console.log('Cantidad:', amount);
  console.log('Email:', email);

  // 🔹 RESPUESTA (confirmación)
  res.json({
    status: 'ok',
    message: 'Vesting recibido correctamente',
    data: {
      wallet,
      amount,
      email
    }
  });
});

// 🔹 Puerto Railway
const PORT = process.env.PORT || 8080;

// 🔹 Arranque servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
