import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const dayOrMonthParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request: Request = context.getRequest();
    const dayOrMonth = {
      day: Number(request['currentDay']),
      month: Number(request['currentMonth']),
    };
    return dayOrMonth as { day: number; month: number };
  },
);
