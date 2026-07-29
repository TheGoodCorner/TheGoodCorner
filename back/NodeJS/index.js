const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

app.get('/api/products', (req, res) => {
  res.json({ message: 'Produits - À remplir plus tard' });
});

app.post('/api/cart', (req, res) => {
  res.json({ message: 'Panier - À remplir plus tard' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
