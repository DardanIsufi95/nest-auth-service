import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RefreshToken } from './refresh-token.entity';
import { UserService } from './user.service';
import { UserMicroservice } from './user.microservice';

@Module({
	imports: [TypeOrmModule.forFeature([User, RefreshToken])],
	providers: [UserService],
	controllers: [UserMicroservice],
	exports: [UserService],
})
export class UserModule {}
