import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsString()
	password: string;

	@IsOptional()
	@IsEnum(UserRole, { message: 'role must be USER, ADMIN, or SUPERADMIN' })
	role?: UserRole;
}
