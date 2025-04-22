import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

export class DayMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const currentDate = new Date();
    req['currentDay'] = currentDate;
    next();
  }
}
