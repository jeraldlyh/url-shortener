import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuth } from './auth.types';

export const Auth = createParamDecorator(
  (data: string, ctx: ExecutionContext): IAuth => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
