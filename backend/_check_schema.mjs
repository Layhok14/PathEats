import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.argv[2] });

const tables = [
  'users',
  'refresh_tokens',
  'session_events',
  'audit_log',
  'reviews',
  'menu_items',
  'place_categories',
  'place_hours',
  'bookmarks',
  'search_history',
  'user_preferences',
  'user_profile_images',
  'place_images',
  'menu_item_images',
  'database_activity_log',
  'routes',
  'role',
];
for (const t of tables) {
  try {
    const { rows } = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${t}' ORDER BY ordinal_position`);
    if (rows.length > 0) { console.log('=== ' + t + ' ==='); console.table(rows); }
    else { console.log(t + ': TABLE NOT FOUND'); }
  } catch(e) { console.log(t + ': ERROR - ' + e.message); }
}
await pool.end();
