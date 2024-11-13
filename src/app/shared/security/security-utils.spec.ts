import { TestBed } from '@angular/core/testing';
import * as CryptoJS from 'crypto-js';
import { EncryptionUtils } from './security-utils'; // Adjust the import path if needed

describe('EncryptionUtils', () => {

  const sampleText = 'NinaPerrufula';

  beforeAll(() => {
    // Override the secretKey with a constant for testing consistency
    (EncryptionUtils as any).secretKey = 'FixedSecretKey123';
  });

  afterAll(() => {
    (EncryptionUtils as any).secretKey = null;
  });

  it('should encrypt a string', () => {
    const encrypted = EncryptionUtils.encrypt(sampleText);
    expect(encrypted).toBeTruthy();
    expect(typeof encrypted).toBe('string');
  });

  it('should decrypt an encrypted string back to the original', () => {
    const encrypted = EncryptionUtils.encrypt(sampleText);
    const decrypted = EncryptionUtils.decrypt(encrypted);
    expect(decrypted).toBe(sampleText);
  });

  it('should return empty string if decryption fails', () => {
    const incorrectEncryptedData = 'InvalidEncryptedString';
    const decrypted = EncryptionUtils.decrypt(incorrectEncryptedData);
    expect(decrypted).toBe('');
  });

  it('should generate a password of specified length with default options', () => {
    const length = 16;
    const generatedPassword = EncryptionUtils.generatePassword(length);
    const decryptedPassword = EncryptionUtils.decrypt(generatedPassword);

    expect(generatedPassword).toBeTruthy();
    expect(generatedPassword.length).toBeGreaterThan(0);
    expect(decryptedPassword.length).toEqual(length);
  });
});
