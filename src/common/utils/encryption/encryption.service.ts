export abstract class EncryptionService {
  abstract encrypt(text: string): string;
  abstract decrypt(text: string): string;
}
