const express = require('express');
const app = express();

app.use(express.json());

// Almacenamiento temporal en memoria (luego lo conectaremos al contrato)
let vestings = [];

// ========================================
// CREAR VESTING (desde Zapier)
// ========================================
app.post('/create-vesting', (req, res) => {
  try {
    const { wallet, amount, email } = req.body;

    // Validación básica
    if (!wallet || !amount || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Faltan datos (wallet, amount, email)'
      });
    }

    console.log("NUEVO VESTING:");
    console.log(req.body);

    // Crear vesting
    const vesting = {
      wallet: wallet.toLowerCase(),
      amount: Number(amount),
      email,
      timestamp: Date.now()
    };

    vestings.push(vesting);

    return res.json({
      status: 'ok',
      message: 'Vesting creado correctamente',
      data: vesting
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
// CONSULTAR VESTING POR WALLET
// ========================================
app.get('/get-vesting/:wallet', (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();

    const results = vestings.filter(v => v.wallet === wallet);

    return res.json({
      status: 'ok',
      total: results.length,
      data: results
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error interno'
    });
  }
});

// ========================================
// SERVIDOR
// ========================================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
