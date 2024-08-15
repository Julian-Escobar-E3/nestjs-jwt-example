import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enums/valid-roles';

@Controller('messagges')
export class MessaggesController {
  @Get('private')
  @Auth(ValidRoles.admin)
  privateMessage() {
    return 'Private Message From Admin';
  }

  @Get('public')
  @Auth(ValidRoles.user)
  publicMessage() {
    return 'Public Message From User';
  }
}
