export default () => ({
    httpPort: parseInt(process.env.HTTP_PORT!, 10) || 3000,
    microservicePort: parseInt(process.env.MICROSERVICE_PORT!, 10) || 8877,
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT!, 10) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        name: process.env.DB_NAME || 'auth_db',
    },
    jwt: {
        accessSecret: process.env.ACCESS_SECRET || 'ACCESS_SECRET',
        refreshSecret: process.env.REFRESH_SECRET || 'REFRESH_SECRET',
    },
});