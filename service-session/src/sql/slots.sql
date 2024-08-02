CREATE DATABASE service_session;

use service_session;

create table if not exists slots(
  id varchar(20) not null,
  mode varchar(20) not null,
  status varchar(20) default "created",
  actived boolean default false,
  seller_id varchar(20) not null,
  seller_pubkeyhash varchar(100) default null,
  buyer_id varchar(20) default null,
  buyer_pubkeyhash varchar(100) default null,
  contract_id varchar(100) not null,
  contract_wid varchar(100) not null,
  contract_units int unsigned not null,
  contract_price int unsigned not null,
  contract_collateral int unsigned not null,
  contract_discount int unsigned not null,
  contract_stage varchar(20) default "inactive",
  contract_0_utx mediumtext default null,
  contract_1_utx mediumtext default null,
  contract_2_utx mediumtext default null,
  contract_3_utx mediumtext default null,
  contract_0_tx varchar(100) default null,
  contract_1_tx varchar(100) default null,
  contract_2_tx varchar(100) default null,
  contract_3_tx varchar(100) default null,  
  product_id varchar(20) not null,
  created_at timestamp default current_timestamp,
  schema_t timestamp default current_timestamp,
  schema_v int unsigned not null,
  primary key(id),
  unique (contract_id)
) ENGINE = InnoDB;