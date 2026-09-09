const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app'); // or './app' depending on your entry point

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/testdb';

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
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