import {
  applyDecorators,
  HttpStatus,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserRoleEnum } from 'src/user/enums/user-role.enum';
import { RoleGuard } from '../guards/role.guard';
import { ApiResponse } from '@nestjs/swagger';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRoleEnum[]) => {
  return applyDecorators(
    UseGuards(RoleGuard),
    SetMetadata(ROLES_KEY, roles),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'The user need to permissions to access this route',
    }),
  );
};
