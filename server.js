const express = require('express');
const path = require('path');
const Postfix = require('./postfix');

const app = express();
const OPS = ['puzzle', 'evaluate', 'check'];

app.use(express.json());
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/postfix.js', (req, res) => res.sendFile(path.join(__dirname, 'postfix.js')));

app.post('/api/:op', (req, res) => {
  const { op } = req.params;
  if (!OPS.includes(op)) return res.status(404).json({ error: 'Unknown operation' });
  try {
    res.json(Postfix[op](req.body || {}));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Postfix Puzzle running on http://localhost:${PORT}`));
