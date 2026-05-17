const express = require("express");
const { ethers } = require("ethers");

const app = express();
app.use(express.json());

// 🔐 ENV
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// 🔗 Provider + Wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// 🧠 ABI mínimo de tu contrato
const abi = [
  "function addGrant(address beneficiary, uint256 amount) external"
];

// 📄 Contrato
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

// ❤️ Ruta de prueba
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Jatycoin backend activo" });
});

// 🚀 ENDPOINT REAL
app.post("/create-grant", async (req, res) => {
  try {
    const { walletAddress, amount } = req.body;

    if (!walletAddress || !amount) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    // 👇 convertir a 18 decimales
    const parsedAmount = ethers.parseUnits(amount.toString(), 18);

    const tx = await contract.addGrant(walletAddress, parsedAmount);
    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

// 🟢 IMPORTANTE PARA RAILWAY
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
