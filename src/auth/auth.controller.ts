import { Controller, Post, Get, Delete, Body, Req, HttpException, HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { MicroserviceClientService } from '../common/microservice-client.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly microserviceClientService: MicroserviceClientService,
	) {}

	@Get('health')
	healthCheck() {
		return this.microserviceClientService.createUser({ name: 'test' });

		return { status: 'ok' };
	}

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
	async getProfile(@Req() req: Request) {
		const authHeader = req.headers['authorization'];
		if (!authHeader) {
			throw new HttpException('Authorization header missing', HttpStatus.UNAUTHORIZED);
		}
		const token = authHeader.split(' ')[1];
		const user = await this.authService.getUserFromToken(token);
		if (!user) {
			throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
		}
		return user;
	}

	@Delete()
	async logout(@Req() req: Request) {
		const authHeader = req.headers['authorization'];
		if (!authHeader) {
			throw new HttpException('Authorization header missing', HttpStatus.UNAUTHORIZED);
		}
		const refreshToken = authHeader.split(' ')[1];
		const result = await this.authService.logout(refreshToken);
		return { success: result };
	}
}
