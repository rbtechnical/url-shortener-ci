const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server');

const MONGO_URI = process.env.MONGO_URL || 'mongodb://127.0.1:27017/testdb';

beforeAll(async () => {
  // Prevent long connection buffering timeouts during test setup
  mongoose.set('bufferCommands', false);
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2000, // Timeout after 2 seconds if DB is unreachable
    });
  } catch (err) {
    console.warn('MongoDB connection failed in test setup:', err.message);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe('URL shortener', () => {
  it('health check returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
  });

  it('shortens a URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ url: 'https://example.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('shortUrl');
  });
});