import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
	) {}

	private getAccessSecret(): string {
		const secret = this.configService.get('jwt.accessSecret');
		if (!secret) {
			throw new InternalServerErrorException('JWT access secret not configured');
		}
		return secret;
	}

	private getRefreshSecret(): string {
		const secret = this.configService.get('jwt.refreshSecret');
		if (!secret) {
			throw new InternalServerErrorException('JWT refresh secret not configured');
		}
		return secret;
	}

	async loginWithCredentials(username: string, password: string) {
		const user = await this.userService.findByUsername(username);
		if (user && user.password === password) {
			const accessToken = jwt.sign(
				{ sub: user.id, username: user.username, role: user.role },
				this.getAccessSecret(),
				{ expiresIn: '15m' },
			);
			const refreshToken = jwt.sign(
				{ sub: user.id, username: user.username, role: user.role },
				this.getRefreshSecret(),
				{ expiresIn: '7d' },
			);
			await this.userService.storeRefreshToken(user, refreshToken);
			return { accessToken, refreshToken, user };
		}
		return null;
	}

	async refreshToken(refreshToken: string) {
		try {
			const decoded = jwt.verify(refreshToken, this.getRefreshSecret()) as any;
			const user = await this.userService.findById(decoded.sub);
			if (!user) return null;
			const valid = await this.userService.validateRefreshToken(user, refreshToken);
			if (!valid) return null;

			const accessToken = jwt.sign(
				{ sub: user.id, username: user.username, role: user.role },
				this.getAccessSecret(),
				{ expiresIn: '15m' },
			);
			const newRefreshToken = jwt.sign(
				{ sub: user.id, username: user.username, role: user.role },
				this.getRefreshSecret(),
				{ expiresIn: '7d' },
			);
			await this.userService.replaceRefreshToken(user, refreshToken, newRefreshToken);
			return { accessToken, refreshToken: newRefreshToken };
		} catch (err) {
			return null;
		}
	}

	async getUserFromToken(token: string) {
		try {
			const decoded = jwt.verify(token, this.getAccessSecret()) as any;
			const user = await this.userService.findById(decoded.sub);
			return user;
		} catch (err) {
			return null;
		}
	}

	async logout(refreshToken: string) {
		// Revoke the refresh token in the database
		const result = await this.userService.revokeRefreshToken(refreshToken);
		return result;
	}
}
