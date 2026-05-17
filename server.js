const express = require('express');
const app = express();

app.use(express.json());

// 🔹 Endpoint de prueba
app.get('/', (req, res) => {
    res.json({ status: "ok", service: "Jatycoin backend activo" });
});

// 🔹 Endpoint de vesting
app.post('/create-vesting', async (req, res) => {

    console.log("NUEVO VESTING:");
    console.log(req.body);

    try {

        const { cartera, cantidad, email } = req.body;

        // Validación básica
        if (!cartera || !cantidad || !email) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos"
            });
        }

        // 🔹 SIMULACIÓN de creación de vesting
        console.log("Procesando vesting...");
        console.log(`Wallet: ${cartera}`);
        console.log(`Cantidad: ${cantidad}`);
        console.log(`Email: ${email}`);

        // Aquí irá más adelante el contrato real

        res.json({
            status: "ok",
            message: "Vesting recibido correctamente",
            data: {
                cartera,
                cantidad,
                email
            }
        });

    } catch (error) {
        console.error("ERROR:", error);

        res.status(500).json({
            status: "error",
            message: "Error interno"
        });
    }
});

// 🔹 Puerto automático (Railway)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
});
