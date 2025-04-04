import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	token: string;

	@Column({ default: false })
	revoked: boolean;

	@ManyToOne(() => User, (user) => user.refreshTokens)
	user: User;
}
