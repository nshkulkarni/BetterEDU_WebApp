CREATE DATABASE betteredudb;

-- User tables will contain both non_peer and peer leaders 
-- attributes email_address PRIMARY, uid PRIMARY, name, age, profile_picture 
CREATE TABLE IF NOT EXISTS users
(
	email_address VARCHAR NOT NULL, 
	pw VARCHAR NOT NULL,
	uid SERIAL NOT NULL,
	user_name VARCHAR NOT NULL, 
	age INT NOT NULL, 
	profile_picture BYTEA , 
	PRIMARY KEY (uid)
); 

-- relation represent groups 
-- attribute group_id, name, date_times array  
CREATE TABLE IF NOT EXISTS groups
(
    gid SERIAL PRIMARY KEY, 
    group_name VARCHAR NOT NULL, 
    date VARCHAR(255),
    time VARCHAR(255),
    group_image VARCHAR(255), 
    description VARCHAR,
    leader VARCHAR(255)
);


 CREATE TABLE IF NOT EXISTS my_groups (
    uid SERIAL NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
    gid SERIAL NOT NULL REFERENCES groups(gid) ON DELETE CASCADE,
    PRIMARY KEY (uid, gid)
);


-- Users joining those groups 
CREATE TABLE IF NOT EXISTS attended_by 
(
	uid SERIAL NOT NULL REFERENCES users(uid) ON DELETE CASCADE, 
	gid SERIAL NOT NULL REFERENCES groups(gid) ON DELETE CASCADE, 
	PRIMARY KEY (uid,gid)
); 

-- Leaders of those groups 
CREATE TABLE IF NOT EXISTS lead_by 
(
	uid SERIAL NOT NULL REFERENCES users(uid) ON DELETE CASCADE , 
	gid SERIAL NOT NULL REFERENCES groups(gid) ON DELETE CASCADE, 
	PRIMARY KEY (uid, gid)
);  
