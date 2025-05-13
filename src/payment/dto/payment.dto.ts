import { PaymentMethodEnum } from '../enums/payment-method.enum';

export class PaymentDto {
  paymentMethod: PaymentMethodEnum;
  price: number;
}
