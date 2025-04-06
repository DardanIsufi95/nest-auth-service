import { Controller, Post, Get, Delete, Body, HttpException, HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MicroserviceClientService } from '../common/microservice-client.service';
import { AuthDto } from './dto/auth.dto';
import { User } from '../user/user.entity';
import { CurrentUser, JwtPayload } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { DataSource } from 'typeorm';
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly microserviceClientService: MicroserviceClientService,
	) {}

	@Public()
	@Get('health')
	healthCheck() {


		return this.microserviceClientService.createUser({ username: 'test', password: 'test' }).catch(e=>{

			if(e.type == "validation_error"){
				throw new UnprocessableEntityException(e)
			}
		});

		return { status: 'ok' };
	}

	@Public()
	@Post()
	async login(@Body() body: AuthDto) {
		const { grant_type } = body;
		if (grant_type === 'credentials') {
			const { username, password } = body;
			const tokens = await this.authService.loginWithCredentials(username!, password!);
			if (!tokens) {
				throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
			}
			return tokens;
		} else if (grant_type === 'refreshtoken') {
			const { refreshToken } = body;
			const tokens = await this.authService.refreshToken(refreshToken!);
			if (!tokens) {
				throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
			}
			return tokens;
		} else {
			throw new HttpException('Invalid grant_type', HttpStatus.BAD_REQUEST);
		}
	}

	@Get()
	getProfile(@CurrentUser() user: User) {
		return user;
	}

	@Get('me')
	getMe(@CurrentUser({ fetchUser: false }) tokenData: JwtPayload) {
		return {
			id: tokenData.sub,
			username: tokenData.username,
			role: tokenData.role
		};
	}

	@Roles('admin')
	@Get('profile')
	getUserProfile(@CurrentUser() user: User) {
		return user;
	}

	@Delete()
	async logout(@Body() body: { refreshToken: string }) {
		const { refreshToken } = body;
		if (!refreshToken) {
			throw new HttpException('Refresh token is required', HttpStatus.BAD_REQUEST);
		}
		
		const result = await this.authService.logout(refreshToken);
		return { success: result };
	}
}
