#!/bin/sh


mysql -u root -ppassword

DROP DATABASE service_gateway;
DROP DATABASE service_product;


mysql -u root -ppassword

use service_gateway;
SELECT COUNT(*) AS total FROM products;


GRANT ALL PRIVILEGES ON *.* TO 'marketplace'@'%';

GRANT CREATE, ALTER, DROP, INDEX, CREATE TEMPORARY TABLES, LOCK TABLES, REFERENCES ON *.* TO 'marketplace'@'%';

GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'marketplace'@'%';

ALTER USER 'marketplace'@'%' IDENTIFIED BY 'password';


SELECT variable_value as "BINARY LOGGING STATUS (log-bin) ::"
FROM performance_schema.global_variables WHERE variable_name='log_bin';


FLUSH PRIVILEGES;



SET GLOBAL max_connections = 100000;

SET GLOBAL binlog_expire_logs_seconds = 604800;

SET GLOBAL thread_cache_size = 600;

SET GLOBAL innodb_buffer_pool_size = 10000000000;

SET GLOBAL innodb_log_buffer_size = 500000000;

SET GLOBAL innodb_flush_log_at_trx_commit = 2;

SET GLOBAL innodb_io_capacity = 4000;

SET GLOBAL tmp_table_size = 250000000;

SET GLOBAL max_heap_table_size = 250000000;

SET GLOBAL max_allowed_packet = 64000000;

SET GLOBAL net_buffer_length = 64000;