import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RoleProtected } from '../decorators';
import { ValidRoles } from '../enums/valid-roles';
import { UserRoleGuard } from '../guards/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
