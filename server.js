const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const app = express();
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/shareddb';

mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const urlSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
});
const Url = mongoose.model('Url', urlSchema);

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

app.listen(3000, () => console.log('Server running on port 3000'));