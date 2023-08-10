import { ExecutionContext } from '@nestjs/common';
import { CreateQrCodeDto, IQrCode, IUrl } from '../url.model';

export const AuthGuardMock = {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    request['user'] = { username: 'user' };

    return true;
  },
};

export const RedirectUrlStub = () => 'http://localhost:3000';
export const RedirectHashStub = () => 'abcef';
export const QrCodeStub = (fgColor?: string): IQrCode => ({
  isCreated: true,
  fgColor: fgColor || '#000',
});

export const UrlStub = (): IUrl[] => [
  {
    url: 'http://localhost:3000',
    qrCode: QrCodeStub(),
    redirectHash: RedirectHashStub(),
    isDeleted: false,
    createdAt: new Date(),
  },
];

export const CreateQrCodeDtoStub = (): CreateQrCodeDto => ({
  redirectHash: RedirectHashStub(),
  qrCode: QrCodeStub('#111'),
});
