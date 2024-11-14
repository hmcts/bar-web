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


  it('should generate the same password for the same seed and configuration', () => {
    const seed = 'consistentSeed';
    const password1 = EncryptionUtils.generateDeterministicPassword(seed, 16, true, true, true);
    const password2 = EncryptionUtils.generateDeterministicPassword(seed, 16, true, true, true);

    expect(password1).toBe(password2);
  });

  it('should generate different passwords for different seeds', () => {
    const password1 = EncryptionUtils.generateDeterministicPassword('seed1', 16, true, true, true);
    const password2 = EncryptionUtils.generateDeterministicPassword('seed2', 16, true, true, true);

    expect(password1).not.toBe(password2);
  });

  it('should generate a password of the specified length', () => {
    const seed = 'testSeed';
    const length = 20;
    const password = EncryptionUtils.generateDeterministicPassword(seed, length, true, true, true);

    expect(password.length).toBe(length);
  });

  it('should only include lowercase characters when all other character options are false', () => {
    const seed = 'lowercaseOnly';
    const password = EncryptionUtils.generateDeterministicPassword(seed, 12, false, false, false);

    expect(password).toMatch(/^[a-z]+$/);
  });

  it('should combine character sets correctly when multiple options are true', () => {
    const seed = 'multipleSets';
    const password = EncryptionUtils.generateDeterministicPassword(seed, 12, true, true, true);

    expect(password).toMatch(/[a-z]/); // Lowercase
  });

  it('should handle an empty seed gracefully', () => {
    const password = EncryptionUtils.generateDeterministicPassword('', 12, true, true, true);

    expect(password.length).toBe(12);
    expect(password).toMatch(/[a-zA-Z0-9!@#$%^&*()_+{}:"<>?|[\];',./`~]/);
  });

  it('should produce consistent hash-based indices in the password', () => {
    const seed = 'testConsistency';
    spyOn(CryptoJS, 'SHA256').and.returnValue({ toString: () => 'a'.repeat(64) });

    const password = EncryptionUtils.generateDeterministicPassword(seed, 10, true, true, true);
    const characterSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}:"<>?|[];\',./`~';

    for (let i = 0; i < password.length; i++) {
      const expectedIndex = parseInt('a', 16) % characterSet.length;
      expect(password[i]).toBe(characterSet[expectedIndex]);
    }
  });
});
