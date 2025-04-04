import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MicroserviceClientService } from '../common/microservice-client.service';

@Module({
	imports: [UserModule],
	providers: [AuthService, MicroserviceClientService],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
