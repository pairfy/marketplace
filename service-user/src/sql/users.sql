CREATE DATABASE service_user;

use service_user;

create table if not exists users(
  id varchar(20) not null,
  username varchar(50) not null,
  address varchar(200) not null,
  pubkeyhash varchar(200) not null,
  country varchar(10) not null,
  terms_accepted boolean not null,
  public_ip varchar(50) not null,
  created_at timestamp default current_timestamp,
  schema_t timestamp default current_timestamp,
  schema_v int unsigned not null,
  primary key(pubkeyhash),
  unique(pubkeyhash)
) ENGINE=InnoDB;
