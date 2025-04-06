import { Controller, UsePipes, InternalServerErrorException, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidatedPayload } from '../common/validated-payload.decorator';
import { TransformResponseInterceptor } from '../common/transform-response.interceptor';

@Controller()
@UseInterceptors(new TransformResponseInterceptor())
export class UserMicroservice {
	constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
	) {}

	private getSecret(type: 'access' | 'refresh'): string {
		const secretPath = type === 'access' ? 'jwt.accessSecret' : 'jwt.refreshSecret';
		const secret = this.configService.get(secretPath);
		if (!secret) {
			throw new InternalServerErrorException(`JWT ${type} secret not configured`);
		}
		return secret;
	}

	@MessagePattern({ cmd: 'user-create' })
	async handleUserCreate(@ValidatedPayload(CreateUserDto) data: CreateUserDto) {
		console.log('Received data for user creation:', data);
		// Expected data: { username, password, role? }
		const user = await this.userService.createUser(data);
		return user;
	}

	@MessagePattern({ cmd: 'user-update' })
	async handleUserUpdate(@Payload() data: any) {
		// Expected data: { id, ...fieldsToUpdate }
		const { id, ...updateData } = data;
		const user = await this.userService.updateUser(id, updateData);
		return user;
	}

	@MessagePattern({ cmd: 'user-delete' })
	async handleUserDelete(@Payload() data: any) {
		// Expected data: { id, soft }
		const { id, soft } = data;
		const result = await this.userService.deleteUser(id, soft);
		return { success: result };
	}

	@MessagePattern({ cmd: 'user-get' })
	async handleUserGet(@Payload() data: any) {
		// Expected data: { id }
		const user = await this.userService.findById(data.id);
		return user;
	}

	@MessagePattern({ cmd: 'user-filter' })
	async handleUserFilter(@Payload() filters: any) {
		const users = await this.userService.filterUsers(filters);
		return users;
	}

	@MessagePattern({ cmd: 'token-verify' })
	async handleTokenVerify(@Payload() data: any) {
		// Expected data: { token, type: 'access' | 'refresh' }
		const tokenType = data.type || 'access';
		
		try {
			const secret = this.getSecret(tokenType);
			const decoded = jwt.verify(data.token, secret);
			return { valid: true, decoded };
		} catch (err) {
			return { valid: false, error: err.message };
		}
	}
}
