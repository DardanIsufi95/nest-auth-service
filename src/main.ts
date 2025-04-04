import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GlobalValidationPipe } from './common/global-validation.pipe';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(GlobalValidationPipe);
	const configService = app.get(ConfigService);

	app.connectMicroservice({
		transport: Transport.TCP,
		options: { port: configService.get<number>('MICROSERVICE_PORT') || 8877 },
	});
	await app.startAllMicroservices();

	const PORT = configService.get<number>('HTTP_PORT') || 3000;
	await app.listen(PORT);
	console.log(`HTTP server running on http://localhost:${PORT}`);
}

bootstrap();
