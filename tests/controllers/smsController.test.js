import test from 'node:test';
import assert from 'node:assert/strict';
import { inboundSms, outboundSms } from "../../controllers/smsController.js";
import smsService from '../../services/smsService.js';

// Mock the service functions
smsService.handleInboundSms = async () => ({ message: 'inbound sms ok', error: '' });
smsService.handleOutboundSms = async () => ({ message: 'outbound sms ok', error: '' });

test('Inbound SMS: should return success message from service', async () => {
    const req = { body: { from: '123456', to: '654321', text: 'Hello' }, account: { id: 1 } };
    const res = { status: (code) => ({ json: (data) => ({ statusCode: code, ...data }) }) };

    const result = await inboundSms(req, res);
    assert.strictEqual(result.statusCode, 200);
    assert.strictEqual(result.message, 'inbound sms ok');
});

test('Outbound SMS: should return success message from service', async () => {
    const req = { body: { from: '123456', to: '654321', text: 'Hello' }, account: { id: 1 } };
    const res = { status: (code) => ({ json: (data) => ({ statusCode: code, ...data }) }) };

    const result = await outboundSms(req, res);
    assert.strictEqual(result.statusCode, 200);
    assert.strictEqual(result.message, 'outbound sms ok');
});

test('Inbound SMS: should return 400 on service error', async () => {
    smsService.handleInboundSms = async () => { throw new Error('to parameter is not found'); };
    const req = { body: { from: '123456', to: '999', text: 'Hello' }, account: { id: 1 } };
    const res = { status: (code) => ({ json: (data) => ({ statusCode: code, ...data }) }) };

    const result = await inboundSms(req, res);
    assert.strictEqual(result.statusCode, 400);
    assert.match(result.error, /to parameter is not found/);
});

test('Outbound SMS: should return 400 on service error', async () => {
    smsService.handleOutboundSms = async () => { throw new Error('from parameter is not found'); };
    const req = { body: { from: 'badnumber', to: '654321', text: 'Hello' }, account: { id: 1 } };
    const res = { status: (code) => ({ json: (data) => ({ statusCode: code, ...data }) }) };

    const result = await outboundSms(req, res);
    assert.strictEqual(result.statusCode, 400);
    assert.match(result.error, /from parameter is not found/);
});
