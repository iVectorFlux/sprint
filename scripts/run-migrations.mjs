import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

const DIRECT_URL = 'postgresql://postgres.wxovxrskfxuhzttzpxfm:Supabase@123@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres';

const sql = postgres(DIRECT_URL, {
  ssl: 'require',
  connect_timeout: 30,
});

const MIGRATIONS = [
  '001_organizations_users.sql',
  '002_user_profiles.sql',
  '003_skills_ontology.sql',
  '004_sprints.sql',
  '005_simulations.sql',
  '006_telemetry.sql',
  '007_memory.sql',
  '008_reports.sql',
  '009_uploads.sql',
  '010_rls_policies.sql',
  '011_seed_skills.sql',
];

async function runMigrations() {
  console.log('🚀 Starting migrations...\n');

  for (const file of MIGRATIONS) {
    const path = join(process.cwd(), 'supabase', 'migrations', file);
    const content = readFileSync(path, 'utf-8');

    try {
      console.log(`⏳ Running ${file}...`);
      await sql.unsafe(content);
      console.log(`✅ ${file} — done`);
    } catch (err) {
      console.error(`❌ ${file} — FAILED`);
      console.error(`   ${err.message}`);
      // Continue with remaining migrations
    }
  }

  console.log('\n🏁 Migrations complete!');
  await sql.end();
}

runMigrations().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
