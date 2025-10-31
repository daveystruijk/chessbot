-- Up Migration

CREATE TYPE winner AS ENUM ('player_a', 'player_b', 'draw');

CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  player_id VARCHAR(255) NOT NULL UNIQUE,
  player_name VARCHAR(255),
  score NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE game_results (
  id SERIAL PRIMARY KEY,
  player_a_id VARCHAR(255) NOT NULL REFERENCES players(player_id) DEFERRABLE INITIALLY DEFERRED,
  player_b_id VARCHAR(255) NOT NULL REFERENCES players(player_id) DEFERRABLE INITIALLY DEFERRED,
  winner winner NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Down Migration

DROP TABLE game_results;
DROP TABLE players;
DROP TYPE winner;
