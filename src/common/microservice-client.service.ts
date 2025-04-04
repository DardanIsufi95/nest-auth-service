import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MicroserviceClientService implements OnModuleInit {
	private client: ClientProxy;

	constructor(private readonly configService: ConfigService) {}

	onModuleInit() {
		const port = this.configService.get<number>('MICROSERVICE_PORT') || 8877;
		this.client = ClientProxyFactory.create({
			transport: Transport.TCP,
			options: { port },
		});

		this.client.connect().then((d) => {
			console.log(`Microservice client connected on port ${port}`, d);
		});
	}

	async createUser(payload: any): Promise<any> {
		return firstValueFrom(this.client.send({ cmd: 'user-create' }, payload));
	}

	async updateUser(payload: any): Promise<any> {
		return firstValueFrom(this.client.send({ cmd: 'user-update' }, payload));
	}

	async deleteUser(payload: any): Promise<any> {
		return firstValueFrom(this.client.send({ cmd: 'user-delete' }, payload));
	}

	async getUser(payload: any): Promise<any> {
		return firstValueFrom(this.client.send({ cmd: 'user-get' }, payload));
	}

	async filterUsers(payload: any): Promise<any> {
		return firstValueFrom(this.client.send({ cmd: 'user-filter' }, payload));
	}

	async verifyToken(payload: any): Promise<any> {
		return firstValueFrom(this.client.send({ cmd: 'token-verify' }, payload));
	}
}
