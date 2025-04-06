import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { GlobalValidationPipe } from './common/global-validation.pipe';
import { TransformResponseInterceptor } from './common/transform-response.interceptor';
import { dataSourceOptions } from './config/data-source';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
			isGlobal: true,
		}),
		TypeOrmModule.forRoot(dataSourceOptions),
		AuthModule,
		UserModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
		{
			provide: APP_PIPE,
			useClass: GlobalValidationPipe,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformResponseInterceptor,
		},
		
	],
})
export class AppModule {}
