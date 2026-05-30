const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const app = express();

app.use(cors());
app.use(express.json());

// ========================================
// CONFIGURACIÓN BLOCKCHAIN
// ========================================

if (!process.env.PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY no configurada');
}

const CONTRACT_ADDRESS =
  '0x20d930Ce3076ce7F91CC4247087322ba9E2bca08';

const RPC_URL =
  'https://bsc-dataseed.binance.org/';

const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'beneficiary',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'addGrant',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

const provider = new ethers.JsonRpcProvider(
  RPC_URL
);

const signer = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

const vestingContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  signer
);

// ========================================
// ARCHIVO JSON
// ========================================

const DATA_FILE = path.join(
  __dirname,
  'vestings.json'
);

// ========================================
// CARGAR VESTINGS
// ========================================

let vestings = [];

if (fs.existsSync(DATA_FILE)) {
  try {
    vestings = JSON.parse(
      fs.readFileSync(DATA_FILE, 'utf8')
    );
  } catch (e) {
    console.error(
      'Error cargando vestings.json:',
      e
    );

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

app.post(
  '/create-vesting',
  async (req, res) => {

    try {

      const wallet =
        req.body.wallet ||
        req.body.cartera;

      const amount =
        req.body.amount ||
        req.body.cantidad;

      const email =
        req.body.email;

      console.log(
        'Nueva solicitud:'
      );

      console.log(req.body);

      if (
        !wallet ||
        amount === undefined ||
        amount === null ||
        !email
      ) {

        return res.status(400).json({
          status: 'error',
          message: 'Faltan datos'
        });

      }

      // ========================================
      // VALIDAR DIRECCIÓN
      // ========================================

      if (
        !ethers.isAddress(wallet)
      ) {

        return res.status(400).json({
          status: 'error',
          message: 'Wallet inválida'
        });

      }

      // ========================================
      // VALIDAR CANTIDAD
      // ========================================

      const numericAmount =
        Number(amount);

      if (
        isNaN(numericAmount) ||
        numericAmount <= 0
      ) {

        return res.status(400).json({
          status: 'error',
          message: 'Cantidad inválida'
        });

      }

      // ========================================
      // CONVERTIR A 18 DECIMALES
      // ========================================

      const blockchainAmount =
        ethers.parseUnits(
          String(numericAmount),
          18
        );

      console.log(
        'Llamando addGrant()'
      );

      console.log(
        'Beneficiary:',
        wallet
      );

      console.log(
        'Amount:',
        blockchainAmount.toString()
      );

      // ========================================
      // ENVIAR TRANSACCIÓN
      // ========================================

      const tx =
        await vestingContract.addGrant(
          wallet,
          blockchainAmount
        );

      console.log(
        'TX enviada:',
        tx.hash
      );

      // ========================================
      // ESPERAR CONFIRMACIÓN
      // ========================================

      const receipt =
        await tx.wait();

      console.log(
        'TX confirmada:',
        receipt.hash
      );

      // ========================================
      // GUARDAR JSON SOLO SI OK
      // ========================================

      const vesting = {

        wallet:
          wallet.toLowerCase(),

        amount:
          numericAmount,

        email:
          email,

        txHash:
          tx.hash,

        blockNumber:
          receipt.blockNumber,

        timestamp:
          Date.now()

      };

      vestings.push(
        vesting
      );

      fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
          vestings,
          null,
          2
        )
      );

      console.log(
        'Vesting guardado'
      );

      return res.status(200).json({

        status: 'ok',

        message:
          'Grant creado correctamente',

        txHash:
          tx.hash,

        blockNumber:
          receipt.blockNumber,

        data:
          vesting

      });

    } catch (error) {

      console.error(
        'ERROR:'
      );

      console.error(error);

      return res.status(500).json({

        status: 'error',

        message:
          error.reason ||
          error.shortMessage ||
          error.message ||
          'Error blockchain'

      });

    }

  }
);

// ========================================
// GET VESTING
// ========================================

app.get(
  '/get-vesting/:wallet',
  (req, res) => {

    try {

      const wallet =
        req.params.wallet.toLowerCase();

      const results =
        vestings.filter(
          v =>
            v.wallet === wallet
        );

      return res.status(200).json({

        status: 'ok',

        total:
          results.length,

        data:
          results

      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({

        status: 'error',

        message:
          'Error interno'

      });

    }

  }
);

// ========================================
// START SERVER
// ========================================

const PORT =
  process.env.PORT || 8080;

app.listen(
  PORT,
  () => {

    console.log(
      `Servidor iniciado en puerto ${PORT}`
    );

    console.log(
      `Wallet firmante: ${signer.address}`
    );

  }
);
