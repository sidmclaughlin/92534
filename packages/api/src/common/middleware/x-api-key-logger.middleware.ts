import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class XApiKeyLoggerMiddlware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const xApiKey = req.headers['x-api-key'] as string;
    if (xApiKey != null) {
      console.log('Api Key Found: ', xApiKey);
    }

    next();
  }
}
