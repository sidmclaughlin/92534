import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'uuid';
import { PrismaService } from '../../providers/prisma/prisma.service';

@Injectable()
export class XApiKeyLoggerMiddlware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const xApiKey = req.headers['x-api-key'] as string;
    if (validate(xApiKey)) {
      await this.prismaService.tokenLog.create({ data: { token: xApiKey, method: req.method, path: req.originalUrl } });
    }

    next();
  }
}
