const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/testdb';

beforeAll(async () => {
  await mongoose.connect(MONGO_URL);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /shorten', () => {
  it('creates a short URL when given a valid url', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ url: 'https://example.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.shortUrl).toBeDefined();
  });

  it('rejects a request with no url', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({});

    expect(res.statusCode).toBe(400);
  });
});

describe('GET /:code', () => {
  it('returns 404 for an unknown short code', async () => {
    const res = await request(app).get('/doesnotexist');
    expect(res.statusCode).toBe(404);
  });
});