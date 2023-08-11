import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';

@Controller()
export class AppController {
  @Get()
  @Public()
  ping(): string {
    return 'Alive';
  }
}
