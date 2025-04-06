import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { TransformResponseInterceptor } from './common/transform-response.interceptor';
import './auth/types';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	// Create microservice
	const microservice = app.connectMicroservice({
		transport: Transport.TCP,
		options: { port: configService.get<number>('MICROSERVICE_PORT') || 8877 },
	});
	
	// Start all microservices
	await app.startAllMicroservices().then(() => {
		console.log(`Microservice client connected on port ${configService.get<number>('MICROSERVICE_PORT') || 8877}`);
	});

	const PORT = configService.get<number>('HTTP_PORT') || 3000;
	await app.listen(PORT);
	console.log(`HTTP server running on http://localhost:${PORT}`);
}

bootstrap();
