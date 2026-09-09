   const request = require('supertest');
   const app = require('../server'); // adjust to however you export your app

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
       expect(res.body).toHaveProperty('shortCode');
     });
   });