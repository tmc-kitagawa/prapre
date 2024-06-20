CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    presentation_id INT,
    page INT,
    eye NUMERIC,
    emotion NUMERIC,
    filler INT,
    elapsed_time INT,
    CONSTRAINT fk_presentations_id
        FOREIGN KEY(presentation_id)
        REFERENCES presentations(id)
);