CREATE TABLE CUSTOMER (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
);

INSERT INTO CUSTOMER (name)
VALUES  ('Jean Dupond');
