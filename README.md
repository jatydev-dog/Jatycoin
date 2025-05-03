
# 🪙 Jatycoin (JTC)

**Jatycoin** es una criptomoneda segura, descentralizada y sencilla de usar, diseñada para transferencias, ahorro e integración con dispositivos físicos Trezor.  
Incluye su propia blockchain, minería básica, nodo web y una wallet visual en Python.

---

## 🚀 Características principales

- 🔗 **Blockchain propia** con bloques firmados y minería por prueba de trabajo (PoW)
- 🔐 **Soporte para Trezor**: solo tú puedes enviar monedas con tu firma
- 💻 **Wallet visual en Python** con envío de JTC y firma física
- 🌐 **Nodo web en Flask** para consultar bloques y saldos
- 📄 **Whitepaper técnico** en español disponible en `/whitepaper/`

---

## 🧾 Distribución total

| Tipo                 | Cantidad      | Porcentaje |
|----------------------|---------------|------------|
| Preasignado (creador)| 50 millones   | 20%        |
| Minería disponible   | 50 millones   | 20%        |
| Circulación pública  | 150 millones  | 60%        |
| **Total**            | **250 millones JTC** | 100% |

---

## 🧰 Estructura del repositorio

```
jatycoin/
├── blockchain/               # Código de bloques y minería
├── wallet/                   # Wallet con Trezor
├── nodo_web/                 # Nodo Flask para ver bloques/saldos
├── whitepaper/               # Documento técnico
├── README.md                 # Este archivo
└── LICENSE                   # Licencia MIT
```

---

## 📦 Cómo usar

### 1. Ejecutar el nodo

```bash
cd nodo_web
python nodo_jatycoin.py
```
Accede a: `http://localhost:5000`

### 2. Usar la billetera

```bash
cd wallet
python jatycoin_wallet_trezor_firma.py
```

---

## 📄 Whitepaper

Lee el whitepaper oficial:  
📂 [`whitepaper/Jatycoin_Whitepaper.txt`](whitepaper/Jatycoin_Whitepaper.txt)

---

## ⚖️ Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo, copiarlo y modificarlo libremente.

---

## 📬 Contacto

¿Ideas, dudas o colaboración?  
Abre un Issue o contáctanos para sumar al proyecto.

---

### ⭐ Si te gusta Jatycoin, no olvides dejar una estrella ⭐ en este repositorio
