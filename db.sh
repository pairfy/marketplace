#!/bin/sh


alias mysql="mysql -h localhost -P 3306 -u marketplace -ppassword"



GRANT ALL PRIVILEGES ON *.* TO 'marketplace'@'%';

GRANT CREATE, ALTER, DROP, INDEX, CREATE TEMPORARY TABLES, LOCK TABLES, REFERENCES ON *.* TO 'marketplace'@'%';

GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'marketplace'@'%';

ALTER USER 'marketplace'@'%' IDENTIFIED BY 'password';


SELECT variable_value as "BINARY LOGGING STATUS (log-bin) ::"
FROM performance_schema.global_variables WHERE variable_name='log_bin';


FLUSH PRIVILEGES;

CREATE DATABASE service_seller;