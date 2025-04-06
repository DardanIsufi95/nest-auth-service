import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MicroserviceClientService } from '../common/microservice-client.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
	imports: [UserModule],
	providers: [
		AuthService, 
		MicroserviceClientService,
		JwtAuthGuard,
		RolesGuard
	],
	controllers: [AuthController],
	exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
