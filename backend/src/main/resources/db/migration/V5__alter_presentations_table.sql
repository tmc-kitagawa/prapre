ALTER TABLE presentations ADD score_eye int;
ALTER TABLE presentations ADD score_volume int;
ALTER TABLE presentations ADD score_filler int;
ALTER TABLE presentations ADD score_speed int;
ALTER TABLE presentations ADD score_time int;

ALTER TABLE presentations ADD FOREIGN KEY (user_id) REFERENCES users (id);