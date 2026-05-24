const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// ========================================
// ARCHIVO JSON
// ========================================

const DATA_FILE = path.join(__dirname, 'vestings.json');

// ========================================
// CARGAR VESTINGS
// ========================================

let vestings = [];

if (fs.existsSync(DATA_FILE)) {

  try {

    vestings = JSON.parse(
      fs.readFileSync(DATA_FILE)
    );

  } catch (e) {

    vestings = [];

  }
}

// ========================================
// HOME
// ========================================

app.get('/', (req, res) => {

  res.send('Jatycoin backend online');

});

// ========================================
// CREATE VESTING
// ========================================

app.post('/create-vesting', (req, res) => {

  try {

    const wallet =
      req.body.wallet ||
      req.body.cartera;

    const amount =
      req.body.amount ||
      req.body.cantidad;

    const email =
      req.body.email;

    console.log(req.body);

    if (!wallet || !amount || !email) {

      return res.status(400).json({
        status: 'error',
        message: 'Faltan datos'
      });

    }

    // ========================================
    // CREAR VESTING
    // ========================================

    const vesting = {

      wallet: wallet.toLowerCase(),
      amount: Number(amount),
      email: email,
      timestamp: Date.now()

    };

    vestings.push(vesting);

    // ========================================
    // GUARDAR JSON
    // ========================================

    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(vestings, null, 2)
    );

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

    const wallet =
      req.params.wallet.toLowerCase();

    const results = vestings.filter(
      v => v.wallet === wallet
    );

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

  console.log(
    `Servidor iniciado en puerto ${PORT}`
  );

});

