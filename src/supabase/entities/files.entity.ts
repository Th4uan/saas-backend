import { Client } from 'src/clients/entities/client.entity';
import { Service } from 'src/services/entities/service.entity';

export class FilesEntity {
  id: string;
  name: string;
  service: Service;
  client: Client;
}
