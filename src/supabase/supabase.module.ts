import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SupabaseController } from './supabase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesEntity } from './entities/files.entity';
import { ServicesModule } from 'src/services/services.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilesEntity]),
    ServicesModule,
    ClientsModule,
  ],
  providers: [SupabaseService],
  exports: [SupabaseService],
  controllers: [SupabaseController],
})
export class SupabaseModule {}
