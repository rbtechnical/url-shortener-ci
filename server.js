const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const app = express();
app.use(express.json());

const urlSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
});
const Url = mongoose.model('Url', urlSchema);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url is required' });

  const shortCode = nanoid(7);
  await Url.create({ shortCode, originalUrl: url });
  res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}` });
});

app.get('/:code', async (req, res) => {
  const entry = await Url.findOne({ shortCode: req.params.code });
  if (!entry) return res.status(404).json({ error: 'not found' });
  res.redirect(entry.originalUrl);
});

// Always place module.exports at the very bottom
module.exports = app;