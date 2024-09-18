CREATE DATABASE service_gateway;

use service_gateway;

create table if not exists orders(
  id varchar(20) not null,
  mode varchar(20) not null,
  status varchar(20) default "created",
  seller_id varchar(20) not null,
  seller_pubkeyhash varchar(100) default null,
  buyer_id varchar(20) default null,
  buyer_pubkeyhash varchar(100) default null,
  contract_address varchar(100) default null,
  contract_state int unsigned default 0,
  contract_threadtoken varchar(100) default null,
  contract_unit varchar(100) default null,
  contract_units int unsigned not null,
  contract_price int unsigned not null,
  contract_collateral int unsigned not null,
  contract_range bigint unsigned default null,
  contract_0_tx varchar(100) default null,
  contract_1_tx varchar(100) default null,
  contract_2_tx varchar(100) default null,
  contract_3_tx varchar(100) default null,
  contract_cancel_tx varchar(100) default null,
  contract_return_tx varchar(100) default null,
  contract_appeal_tx varchar(100) default null,
  product_id varchar(20) not null,
  product_discount int unsigned not null,
  created_at timestamp default current_timestamp,
  schema_t timestamp default current_timestamp,
  schema_v int unsigned not null,
  primary key(id),
  unique (id)
) ENGINE = InnoDB;