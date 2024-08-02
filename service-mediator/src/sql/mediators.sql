CREATE DATABASE service_mediator;

use service_mediator;

create table if not exists mediators(
  id varchar(20) not null,
  username varchar(50) not null,
  email varchar(100) not null,
  password_hash varchar(255) not null,
  verified boolean default false,
  country varchar(10) not null,
  terms_accepted boolean not null,
  public_ip varchar(50) not null,
  created_at timestamp default current_timestamp,
  last_login timestamp default current_timestamp,
  schema_t timestamp default current_timestamp,
  schema_v int unsigned not null,
  primary key(id),
  unique(email, username)
) ENGINE=InnoDB;
