CREATE DATABASE service_gateway;

use service_gateway;

create table if not exists products(
  id varchar(20) not null,
  seller_id varchar(20) not null,
  name varchar(200) not null,
  model varchar(200) not null,
  features varchar(1000) not null,
  terms_of_sale varchar(1000) not null,
  guarantee varchar(1000) not null,
  category varchar(100) not null,
  price int unsigned default 0,
  collateral int unsigned default 0,
  discount int unsigned default 0,
  stock int unsigned default 0,
  keywords varchar(100) not null,
  country varchar(10) not null,
  moderated boolean default false,
  media_url varchar(255) not null,
  media_path varchar(255) not null,
  image_main varchar(255) not null,
  image_set varchar(500) not null,
  video_set varchar(500) default "",
  created_at timestamp default current_timestamp,
  schema_t timestamp default current_timestamp,
  schema_v int unsigned not null,
  primary key(id)
) ENGINE=InnoDB;

