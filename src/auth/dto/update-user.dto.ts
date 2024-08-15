import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ValidRoles } from '../enums/valid-roles';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  @IsIn([ValidRoles])
  role: string[];
}
