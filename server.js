const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// 📁 Archivo donde guardamos los vestings
const DB_PATH = path.join(__dirname, 'vestings.json');

// Crear archivo si no existe
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

// Leer vestings
function readDB() {
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data);
}

// Guardar vestings
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// 🔹 Health check
app.get('/', (req, res) => {
  res.json({ status: "ok", service: "Jatycoin backend activo" });
});

// 🔹 CREAR VESTING (desde Zapier)
app.post('/create-vesting', (req, res) => {
  try {
    const { cartera, cantidad, email } = req.body;

    if (!cartera || !cantidad || !email) {
      return res.status(400).json({ status: "error", message: "Faltan datos" });
    }

    const vestings = readDB();

    const nuevo = {
      id: Date.now(),
      cartera,
      cantidad,
      email,
      fecha: new Date().toISOString()
    };

    vestings.push(nuevo);
    writeDB(vestings);

    console.log("✅ VESTING GUARDADO:", nuevo);

    res.json({
      status: "ok",
      message: "Vesting guardado",
      data: nuevo
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error interno" });
  }
});

// 🔹 CONSULTAR VESTINGS POR WALLET
app.get('/get-vesting/:wallet', (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();

    const vestings = readDB();

    const resultados = vestings.filter(v =>
      v.cartera.toLowerCase() === wallet
    );

    res.json({
      status: "ok",
      total: resultados.length,
      data: resultados
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Error interno" });
  }
});

// 🔹 Puerto Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
