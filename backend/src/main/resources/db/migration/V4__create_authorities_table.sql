CREATE TABLE authorities
(
    id        SERIAL PRIMARY KEY,
    username  TEXT,
    authority TEXT,
    Constraint fk_authorities_users FOREIGN KEY (username) REFERENCES users (username)
);