CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    password VARCHAR(128) NOT NULL,
    salt VARCHAR(32) NOT NULL,
    email VARCHAR(80) NOT NULL,
    bio TEXT,
    img_url VARCHAR(300),
    admin BOOLEAN NOT NULL DEFAULT False,
    blocked BOOLEAN NOT NULL DEFAULT False,
    VERIFIED BOOLEAN NOT NULL DEFAULT False,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(username),
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS user_tokens (
    user_id INT REFERENCES users,
    token TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type VARCHAR(8) NOT NULL,
    poster INT REFERENCES users,
    time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT,
    img_url VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS event_goers (
    event_id int REFERENCES events,
    user_id int REFERENCES users,
    UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    event_id int REFERENCES events,
    commenter int REFERENCES users, 
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS comment_reports (
    comment_id INT REFERENCES comments,
    reporter_id INT REFERENCES users,
    UNIQUE(comment_id, reporter_id)
);
