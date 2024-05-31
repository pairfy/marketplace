CREATE DATABASE service_media;

use service_media;

create table if not exists media(
  media_id varchar(20) not null,
  seller_id varchar(20) not null,
  media_type varchar(20) not null,
  media_mimetype varchar(20) not null,
  media_data longblob not null,
  media_status varchar(20) default "created",
  created_at timestamp default current_timestamp,
  schema_t timestamp default current_timestamp,
  schema_v int unsigned not null,
  primary key(media_id)
) ENGINE=InnoDB;

