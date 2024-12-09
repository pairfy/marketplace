create table if not exists books(
  id varchar(50) not null,
  seller_id varchar(20) not null,
  product_sku varchar(100) not null,
  keeping_stock bigint default 0,
  ready_stock bigint default 0,
  blocked_stock bigint default 0,
  disable_purchases boolean default false,
  created_at timestamp default current_timestamp,
  schema_v int unsigned default 0,
  primary key(id),
  index idx_product_sku (product_sku),
  index idx_seller_id (seller_id),
  foreign key (id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;
