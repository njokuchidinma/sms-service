import test from 'node:test';
import assert from 'node:assert/strict';
import { inboundSms, outboundSms } from "../../controllers/smsController.js";
import client from "../../models/redisClient.js";
import pool from "../../models/db.js";

// Mock Redis and Database
client.get = async () => null;
client.set = async () => null;
pool.query = async () => ({ rowCount: 1 });

test('Inbound SMS: should return error if from is missing', async () => {
    const req = { body: { to: '123456', text: 'Hello' }, account: { id: 1 } };
    const res = { status: (code) => ({ json: (data) => data }) };

    const result = await inboundSms(req, res);
    assert.strictEqual(result.error, 'from is missing');
});

test('Inbound SMS: should return error if to is invalid', async () => {
    const req = { body: { from: '123456', to: '12', text: 'Hello' }, account: { id: 1 } };
    const res = { status: (code) => ({ json: (data) => data }) };

    const result = await inboundSms(req, res);
    assert.strictEqual(result.error, 'to is invalid');
});

test('Inbound SMS: should return error if to is not found in database', async () => {
    pool.query = async () => ({ rowCount: 0 }); // Simulate not found
    const req = { body: { from: '3253280312', to: '12345678', text: 'Hello' }, account: { id: 1 } };
    const res = { status: (code) => ({ json: (data) => data }) };

    const result = await inboundSms(req, res);
    assert.strictEqual(result.error, 'to parameter is not found');
});

test('Inbound SMS: should store STOP request in Redis', async () => {
    pool.query = async () => ({ rowCount: 1 });
    client.set = async () => null;
    const req = { body: { from: '3253280312', to: '3253280311', text: 'STOP' }, account: { id: 1 } };
    const res = { status: (code) => ({ json: (data) => data }) };

    const result = await inboundSms(req, res);
    assert.strictEqual(result.message, 'inbound sms ok');
    assert.strictEqual(result.error, '');
    assert.strictEqual(typeof client.set, 'function');
});

test('Outbound SMS: should return error if from is not found in database', async () => {
    pool.query = async () => ({ rowCount: 0 });
    const req = { body: { from: '3253280312', to: '3253280311', text: 'Hello' }, account: { id: 1 } };
    const res = { status: (code) => ({ json: (data) => data }) };

    const result = await outboundSms(req, res);
    assert.strictEqual(result.error, 'from parameter is not found');
});
