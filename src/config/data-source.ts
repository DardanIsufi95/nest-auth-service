import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config();

export const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: process.env.MIGRATION_DB_HOST || 'localhost',
	port: parseInt(process.env.MIGRATION_DB_PORT!, 10) || 5432,
	username: process.env.MIGRATION_DB_USERNAME || 'postgres',
	password: process.env.MIGRATION_DB_PASSWORD || 'postgres',
	database: process.env.MIGRATION_DB_NAME || 'authservice',
	synchronize: false,
	entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
	migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource; 