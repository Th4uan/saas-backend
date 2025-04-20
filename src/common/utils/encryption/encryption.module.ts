import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { CryptService } from './crypt.service';

@Module({
  providers: [
    {
      provide: EncryptionService,
      useClass: CryptService,
    },
  ],
  exports: [EncryptionService],
})
export class EncryptionModule {}
