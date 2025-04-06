# Database Migrations

This project uses TypeORM for database migrations. Migrations allow you to keep your database schema in sync with your entity models and make incremental changes to the database in a controlled manner.

## Migration Commands

The following commands are available for working with migrations:

### Generate a Migration

To generate a migration based on entity changes:

```bash
npm run migration:generate YourMigrationName
```

This will create a new migration file with the format `{timestamp}-your-migration-name.ts`.

### Create a Migration Manually

To create an empty migration file:

```bash
npm run migration:create YourMigrationName
```

### Run Migrations

To apply pending migrations:

```bash
npm run migration:run
```

### Revert Migration

To revert the most recent migration:

```bash
npm run migration:revert
```

### Start with Migrations

To run migrations before starting the application:

```bash
npm run start:migrate
```

## Migration Directory Structure

All migrations are stored in the `src/migrations` directory. Each migration file contains an implementation of the `MigrationInterface` with `up` and `down` methods:

- The `up` method is used to apply changes to the database.
- The `down` method is used to revert those changes.

## Best Practices

1. Always generate or create migrations in a development environment.
2. Test migrations by running them and verifying the database schema.
3. Include migrations in your version control system.
4. Before deploying to production, test migrations in a staging environment.
5. Back up your production database before running migrations.
6. Use camelCase for migration names; they will be automatically converted to kebab-case in the file name.

## Configuration

Migrations are configured in `src/config/data-source.ts`. This file sets up the TypeORM data source with the following options:

- Database connection details from environment variables
- Paths to entity and migration files
- The `synchronize` flag is set based on the `DB_SYNCHRONIZE` environment variable (should be `false` in production) 