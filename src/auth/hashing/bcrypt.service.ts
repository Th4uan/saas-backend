import { HashingService } from './hashing.service';
import * as bcrypt from 'bcryptjs';

export class BcryptService extends HashingService {
  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
