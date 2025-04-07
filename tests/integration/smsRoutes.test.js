import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../../server.js';
import client from '../../models/redisClient.js';
import sequelize from '../../models/sequelize.js';
import Account from '../../models/Account.js';
import PhoneNumber from '../../models/PhoneNumber.js';

const AUTH_USERNAME = 'azr1';
const AUTH_PASSWORD = '20S0KPNOIM';
const authHeader = { Authorization: 'Basic ' + Buffer.from(`${AUTH_USERNAME}:${AUTH_PASSWORD}`).toString('base64') };

beforeEach(async () => {
  await sequelize.sync();

  await Account.findOrCreate({
    where: { username: AUTH_USERNAME },
    defaults: { auth_id: AUTH_PASSWORD }
  });

  await PhoneNumber.findOrCreate({
    where: { number: '3253280311' },
    defaults: { account_id: 1 }
  });

  await PhoneNumber.findOrCreate({
    where: { number: '3253280312' },
    defaults: { account_id: 1 }
  });

  await client.flushAll();
});

test('POST /inbound/sms/ - Successful Request', async () => {
  const response = await request(app)
    .post('/inbound/sms/')
    .set(authHeader)
    .send({ from: '3253280312', to: '3253280311', text: 'Wagwan' });

  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(response.body, { message: 'inbound sms ok', error: '' });
});

test('POST /outbound/sms/ - Blocked by STOP', async () => {
  // Send a real STOP message to block future outbound
  await request(app)
    .post('/inbound/sms/')
    .set(authHeader)
    .send({ from: '3253280312', to: '3253280311', text: 'STOP' });

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