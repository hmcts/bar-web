import * as CryptoJS from 'crypto-js';


export class EncryptionUtils {

  private static readonly SECRET_KEY = EncryptionUtils.generateDeterministicPassword("semillaLoca", 16, true, true, true);

  /**
   * Encrypts a provided string using AES encryption.
   *
   * This static method encrypts a plain text string using the AES algorithm with a
   * predefined secret key. The encrypted result is returned in Base64 format.
   *
   * @param {string} data - The plain text string to be encrypted.
   * @returns {string} The AES-encrypted string in Base64 format.
   *
   * @example
   * // Encrypt a simple string
   * const encryptedText = EncryptionUtils.encrypt("Hello, World!");
   * console.log(encryptedText); // Outputs: "U2FsdGVkX1+QmD3..."
   *
   * @remarks
   * - This method is stateless and can be used directly without instantiating the `EncryptionUtils` class.
   * - Ensure `crypto-js` library is installed and properly imported into the project.
   * - The `SECRET_KEY` must be consistent between encryption and decryption to retrieve the original data.
   *
   * @requires `CryptoJS.AES` for encryption functionality.
   *
   * @angular
   * @category Utility
   */

  static encrypt(data: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, EncryptionUtils.SECRET_KEY).toString();
    return encrypted;
  }


  /**
   * Decrypts an AES-encrypted string back to its original plain text form.
   *
   * This static method takes an encrypted string in Base64 format, decrypts it
   * using AES decryption with a predefined secret key, and returns the original plain text.
   *
   * @param {string} encryptedData - The encrypted string (Base64 format) to be decrypted.
   * @returns {string} The original plain text string after decryption.
   *
   * @example
   * // Decrypt an encrypted string
   * const decryptedText = EncryptionUtils.decrypt(encryptedData);
   * console.log(decryptedText); // Outputs: "Hello, World!"
   *
   * @remarks
   * - This method assumes the encryption used the same secret key found in `EncryptionUtils.SECRET_KEY`.
   * - If decryption fails (e.g., with a mismatched key), the method may return an empty string or throw an error.
   * - Ensure that the `crypto-js` library is installed and correctly configured in your Angular project.
   *
   * @requires `CryptoJS.AES` for decryption functionality.
   *
   * @angular
   * @category Utility
   */
  static decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, EncryptionUtils.SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  }


  /**
   * Generates a random password with configurable options for length and character types.
   *
   * This static method creates a secure password based on specified requirements, including
   * uppercase letters, numbers, and special characters. The generated password is then encrypted
   * before being returned.
   *
   * @param {number} [length=12] - The length of the password to be generated. Defaults to 12 characters.
   * @param {boolean} [includeUppercase=true] - Whether to include uppercase letters in the password. Defaults to `true`.
   * @param {boolean} [includeNumbers=true] - Whether to include numeric digits (0-9) in the password. Defaults to `true`.
   * @param {boolean} [includeSpecialChars=true] - Whether to include special characters in the password. Defaults to `true`.
   * @returns {string} The encrypted version of the randomly generated password.
   *
   * @example
   * // Generate a 16-character password with all character types
   * const password = EncryptionUtils.generatePassword(16, true, true, true);
   * console.log(password); // Outputs an encrypted password string
   *
   * @example
   * // Generate an 8-character password with only lowercase letters and numbers
   * const password = EncryptionUtils.generatePassword(8, false, true, false);
   * console.log(password); // Outputs an encrypted password string
   *
   * @remarks
   * - The `crypto-js` library is required to encrypt the generated password.
   * - Passwords are generated randomly using a pool of lowercase letters by default,
   *   with optional additions of uppercase letters, numbers, and special characters.
   * - Encrypted passwords can be decrypted with the `decrypt` method in the `EncryptionUtils` class.
   *
   * @requires `CryptoJS.AES` for encryption of the password.
   *
   * @angular
   * @category Utility
   */
  static  generatePassword(length: number = 12, includeUppercase: boolean = true, includeNumbers: boolean = true, includeSpecialChars: boolean = true): string {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+{}:"<>?|[];\',./`~';

    let characterPool = lowercaseChars;
    if (includeUppercase) characterPool += uppercaseChars;
    if (includeNumbers) characterPool += numberChars;
    if (includeSpecialChars) characterPool += specialChars;

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length);
      password += characterPool[randomIndex];
    }

    return EncryptionUtils.encrypt(password);
  }


  /**
   * Generates a deterministic secure password based on a seed.
   *
   * @param seed {string} - A fixed seed string that ensures the same password is generated each time.
   * @param length {number} - Length of the generated password. Defaults to 12 characters.
   * @param includeUppercase {boolean} - Whether to include uppercase letters. Defaults to true.
   * @param includeNumbers {boolean} - Whether to include numeric digits. Defaults to true.
   * @param includeSpecialChars {boolean} - Whether to include special characters. Defaults to true.
   * @returns {string} - The deterministic password.
   */
  static generateDeterministicPassword(
    seed: string,
    length: number = 12,
    includeUppercase: boolean = true,
    includeNumbers: boolean = true,
    includeSpecialChars: boolean = true
  ): string {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+{}:"<>?|[];\',./`~';

    let characterPool = lowercaseChars;
    if (includeUppercase) characterPool += uppercaseChars;
    if (includeNumbers) characterPool += numberChars;
    if (includeSpecialChars) characterPool += specialChars;

    // Hash the seed to produce a consistent "random" sequence
    const hash = CryptoJS.SHA256(seed).toString(CryptoJS.enc.Hex);

    let password = '';
    for (let i = 0; i < length; i++) {
      // Use parts of the hash as indices to select characters
      const hashPosition = i % hash.length;
      const randomIndex = parseInt(hash[hashPosition], 16) % characterPool.length;
      password += characterPool[randomIndex];
    }

    return password;
  }

}
