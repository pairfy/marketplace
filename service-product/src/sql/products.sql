CREATE DATABASE service_product;

use service_product;

create table if not exists products(
  id varchar(20) not null,
  seller_id varchar(20) not null,
  name varchar(200) not null,
  description varchar(1000) not null,
  category varchar(100) not null,
  price int unsigned default 0,
  collateral int unsigned default 0,
  stock int unsigned default 0,
  stock_status varchar(125) default "out",
  keywords varchar(100) not null,
  theme varchar(100) default "modern",
  country varchar(10) not null,
  moderated boolean default false,
  image_base varchar(255) not null,
  image_path varchar(255) not null,
  image_main varchar(255) not null,
  image_set varchar(500) not null,
  created_at timestamp default current_timestamp,
  schema_t timestamp default current_timestamp,
  schema_v int unsigned not null,
  primary key(id)
) ENGINE=InnoDB;

