import { ExecutionContext } from '@nestjs/common';
import { IAuth } from '../auth.types';

export const AuthStub = (): IAuth => ({
  username: 'test',
  iat: '123',
  exp: '123',
  token: '123',
});

export const JwtStub = (): string => 'test';

export const AuthGuardMock = {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    request['user'] = { username: 'user' };

    return true;
  },
};
