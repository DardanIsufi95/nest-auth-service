import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { IsEnum, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export enum UserRole {
	USER = 'USER',
	ADMIN = 'ADMIN',
	SUPERADMIN = 'SUPERADMIN',
}

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	username: string;

	@Exclude()
	@Column()
	password: string;

	@Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
	role: UserRole;

	@Column({ default: false })
	deleted: boolean;

	@OneToMany(() => RefreshToken, (token) => token.user, { cascade: true })
	refreshTokens: RefreshToken[];
}
