const { spawn } = require('child_process');
const path = require('path');

// Get migration name from command line argument
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name');
  console.error('Usage: node scripts/migration-create.js <migration-name>');
  process.exit(1);
}

// Format the migration name to be TypeORM compatible
const formattedName = migrationName
  .replace(/([a-z])([A-Z])/g, '$1-$2') // Convert camelCase to kebab-case
  .replace(/\s+/g, '-') // Replace spaces with hyphens
  .toLowerCase();

// Build the full path for the migration
const migrationsDir = path.join(__dirname, '../src/migrations');
const migrationPath = path.join(migrationsDir, formattedName);

// Execute TypeORM CLI command using npm run with typeorm-create
const typeorm = spawn(
  'npm', 
  [
    'run',
    'typeorm-create',
    '--',
    'migration:create',
    migrationPath
  ],
  { 
    shell: true,
    stdio: 'inherit'
  }
);

typeorm.on('close', (code) => {
  if (code === 0) {
    console.log(`\nEmpty migration ${formattedName} created successfully!`);
  } else {
    console.error(`\nFailed to create migration with exit code ${code}`);
  }
}); 