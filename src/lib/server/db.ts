import pg from 'pg';
const env = process.env;
export const pool = new pg.Pool({ connectionString: env.DATABASE_URL, max: 10 });
pool.on('error', (error) => console.error('Datenbankverbindung unterbrochen', error));
export const query = (text: string, values: unknown[] = []) => pool.query(text, values);
export const secure = () => env.SECURE_MODE === 'true';
