import { IsString, IsNotEmpty, ValidateIf, IsIn } from 'class-validator';

export class AuthDto {
	@IsString()
	@IsNotEmpty()
	@IsIn(['credentials', 'refreshtoken'])
	grant_type: 'credentials' | 'refreshtoken';

	@ValidateIf((o) => o.grant_type === 'credentials')
	@IsString()
	@IsNotEmpty()
	username?: string;

	@ValidateIf((o) => o.grant_type === 'credentials')
	@IsString()
	@IsNotEmpty()
	password?: string;

	@ValidateIf((o) => o.grant_type === 'refreshtoken')
	@IsString()
	@IsNotEmpty()
	refreshToken?: string;
}
