import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './user.entity';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(RefreshToken)
		private readonly tokenRepository: Repository<RefreshToken>,
	) {}

	async createUser(data: Partial<User>) {
		const user = this.userRepository.create({
			...data,
			role: data.role || UserRole.USER
		});
		return this.userRepository.save(user);
	}

	async updateUser(id: string, data: Partial<User>) {
		await this.userRepository.update(id, data);
		return this.findById(id);
	}

	async deleteUser(id: string, soft: boolean = true) {
		const user = await this.findById(id);
		if (!user) return false;
		if (soft) {
			await this.userRepository.softDelete(id);
		} else {
			await this.userRepository.delete(id);
		}
		return true;
	}

	async findById(id: string) {
		return this.userRepository.findOne({ where: { id }, relations: ['refreshTokens'] });
	}

	async findByUsername(username: string) {
		return this.userRepository.findOne({ where: { username }, relations: ['refreshTokens'] });
	}

	async filterUsers(filters: Partial<User>) {
		return this.userRepository.find({ where: { ...filters } });
	}

	// Refresh token operations

	async storeRefreshToken(user: User, token: string) {
		const newToken = this.tokenRepository.create({ token, user });
		return this.tokenRepository.save(newToken);
	}

	async validateRefreshToken(user: User, token: string) {
		const found = await this.tokenRepository.findOne({ where: { token, user, revoked: false } });
		return !!found;
	}

	async replaceRefreshToken(user: User, oldToken: string, newToken: string) {
		const tokenRecord = await this.tokenRepository.findOne({ where: { token: oldToken, user, revoked: false } });
		if (tokenRecord) {
			tokenRecord.revoked = true;
			await this.tokenRepository.save(tokenRecord);
		}
		return this.storeRefreshToken(user, newToken);
	}

	async revokeRefreshToken(token: string) {
		const tokenRecord = await this.tokenRepository.findOne({ where: { token, revoked: false } });
		if (!tokenRecord) return false;
		tokenRecord.revoked = true;
		await this.tokenRepository.save(tokenRecord);
		return true;
	}
}
