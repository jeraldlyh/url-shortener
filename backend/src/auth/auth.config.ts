import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      global: true,
      secret: process.env.AUTH_SECRET || '',
      signOptions: { expiresIn: '1d' },
    };
  },
};
