import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../../server.js';
import pool from '../../models/db.js';
import client from '../../models/redisClient.js';

// Mock Database and Redis
pool.query = async () => ({ rowCount: 1, rows: [{ id: 1 }] });
client.get = async () => null;
client.set = async () => null;

const authHeader = { Authorization: 'Basic ' + Buffer.from('azr1:20S0KPNOIM').toString('base64') };

test('POST /inbound/sms/ - Successful Request', async () => {
  const response = await request(app)
    .post('/inbound/sms/')
    .set(authHeader)
    .send({ from: '3253280312', to: '3253280311', text: 'Wagwan' });

  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(response.body, { message: 'inbound sms ok', error: '' });
});

test('POST /outbound/sms/ - Blocked by STOP', async () => {
  client.get = async () => 'blocked'; // Simulating STOP
  const response = await request(app)
    .post('/outbound/sms/')
    .set(authHeader)
    .send({ from: '3253280312', to: '3253280311', text: 'Hello' });

  assert.strictEqual(response.status, 400);
  assert.match(response.body.error, /blocked by STOP request/);
});

test('POST /inbound/sms/ - Missing Parameter', async () => {
  const response = await request(app)
    .post('/inbound/sms/')
    .set(authHeader)
    .send({ to: '3253280311', text: 'Hello' });

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.error, 'from is missing');
});
