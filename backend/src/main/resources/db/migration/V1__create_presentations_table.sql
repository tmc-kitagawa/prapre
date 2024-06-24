CREATE TABLE presentations (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    starttime BIGINT,
    user_id INT
);