import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';

import migrations from '../../drizzle/migrations';
import * as schema from './schema';

const client = openDatabaseSync('fitness_tracker.db', {
  enableChangeListener: true,
});

export const db = drizzle(client, { schema });

export async function initializeDatabase(): Promise<void> {
  await migrate(db, migrations);
}
