import * as CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

export function encodeRequest(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function signRequest(payload) {
  return CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);
}
