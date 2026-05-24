const express = require('express');

console.log("VERSION NUEVA SERVER OK");

const app = express();

app.use(express.json());

// ========================================
// BASE TEMPORAL EN MEMORIA
// ========================================
let vestings = [];

// ========================================
// CREATE VESTING
// ========================================
app.post('/create-vesting', (req, res) => {

  console.log("BODY RECIBIDO:");
  console.log(req.body);

  try {

    // ACEPTAR AMBOS NOMBRES
    const wallet = req.body.wallet || req.body.cartera;
    const amount = req.body.amount || req.body.cantidad;
    const email = req.body.email;

    console.log("wallet:", wallet);
    console.log("amount:", amount);
    console.log("email:", email);

    // VALIDACIÓN
    if (!wallet || !amount || !email) {

      console.log("FALTAN DATOS");

      return res.status(400).json({
        status: 'error',
        message: 'Faltan datos'
      });
    }

    // CREAR VESTING
    const vesting = {
      wallet: wallet.toLowerCase(),
      amount: Number(amount),
      email: email,
      timestamp: Date.now()
    };

    vestings.push(vesting);

    console.log("VESTING CREADO:");
    console.log(vesting);

    return res.status(200).json({
      status: 'ok',
      message: 'Vesting creado correctamente',
      data: vesting
    });

  } catch (error) {

    console.error("ERROR INTERNO:");
    console.error(error);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno'
    });
  }
});

// ========================================
// GET VESTING
// ========================================
app.get('/get-vesting/:wallet', (req, res) => {

  try {

    const wallet = req.params.wallet.toLowerCase();

    const results = vestings.filter(v => v.wallet === wallet);

    return res.status(200).json({
      status: 'ok',
      total: results.length,
      data: results
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: 'error',
      message: 'Error interno'
    });
  }
});

// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
