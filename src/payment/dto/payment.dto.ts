import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { PaymentStatusEnum } from '../enums/payment-status.enum';

export class PaymentDto {
  paymentMethod: PaymentMethodEnum;
  price: number;
  status: PaymentStatusEnum;
}
