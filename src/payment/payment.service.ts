import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { PaymentDto } from './dto/payment.dto';
import { PaymentStatusEnum } from './enums/payment-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async createPayment(payment: PaymentDto): Promise<Payment> {
    const data = {
      paymentMethod: payment.paymentMethod,
      price: payment.price,
      status: PaymentStatusEnum.PENDING,
    };

    if (!data) {
      throw new BadRequestException('Error creating payment');
    }

    const savedPayment = this.paymentRepository.create(data);

    if (!savedPayment) {
      throw new BadRequestException('Error creating payment');
    }

    await this.paymentRepository.save(savedPayment);

    return savedPayment;
  }
}
