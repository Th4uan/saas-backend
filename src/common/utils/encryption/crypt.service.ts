import { EncryptionService } from './encryption.service';
import * as crypto from 'crypto';

export class CryptService extends EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = Buffer.from(process.env.CRYPT_KEY!, 'hex');

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }
  decrypt(text: string): string {
    const [iv, encryptedText] = text.split(':');
    const cypher = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, cypher);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
