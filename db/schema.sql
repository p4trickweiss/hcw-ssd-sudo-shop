CREATE TABLE IF NOT EXISTS users (
 id serial PRIMARY KEY, username text UNIQUE NOT NULL, password_hash text NOT NULL, balance integer NOT NULL CHECK(balance>=0), private_note text NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS products (
 id serial PRIMARY KEY, name text NOT NULL, description text NOT NULL, price integer NOT NULL CHECK(price>0), color text NOT NULL, category text NOT NULL, is_flag boolean NOT NULL DEFAULT false, flag_reward text NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS sessions (id text PRIMARY KEY, user_id integer REFERENCES users ON DELETE CASCADE, expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS cart_items (user_id integer REFERENCES users ON DELETE CASCADE, product_id integer REFERENCES products, quantity integer NOT NULL CHECK(quantity BETWEEN 1 AND 99), PRIMARY KEY(user_id,product_id));
CREATE TABLE IF NOT EXISTS coupons (code text PRIMARY KEY, percent integer NOT NULL CHECK(percent BETWEEN 1 AND 100));
CREATE TABLE IF NOT EXISTS cart_coupons (id serial PRIMARY KEY, user_id integer REFERENCES users ON DELETE CASCADE, code text REFERENCES coupons);
CREATE TABLE IF NOT EXISTS orders (id serial PRIMARY KEY, user_id integer REFERENCES users, total integer NOT NULL CHECK(total>=0), subtotal integer NOT NULL, payment text NOT NULL DEFAULT 'simulated', note text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS order_items (id serial PRIMARY KEY, order_id integer REFERENCES orders ON DELETE CASCADE, product_id integer REFERENCES products, name text NOT NULL, price integer NOT NULL, quantity integer NOT NULL CHECK(quantity>0));
CREATE TABLE IF NOT EXISTS order_discounts (id serial PRIMARY KEY, order_id integer REFERENCES orders ON DELETE CASCADE, code text NOT NULL, amount integer NOT NULL);
CREATE TABLE IF NOT EXISTS challenges (id text PRIMARY KEY, flag_hash text NOT NULL);
CREATE TABLE IF NOT EXISTS solves (user_id integer REFERENCES users ON DELETE CASCADE, challenge_id text REFERENCES challenges, solved_at timestamptz NOT NULL DEFAULT NOW(), PRIMARY KEY(user_id,challenge_id));
CREATE TABLE IF NOT EXISTS xss_tokens (token text PRIMARY KEY, attacker_id integer REFERENCES users ON DELETE CASCADE, leaked_note text, created_at timestamptz NOT NULL DEFAULT NOW());
