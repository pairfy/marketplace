create table if not exists events(
  id varchar(50) not null,
  event_type varchar(100) not null,
  published boolean default false,
  payload mediumtext not null,
  agent_id varchar(50) default null,
  created_at timestamp default current_timestamp,
  event_version int unsigned not null,
  primary key(id),
  INDEX idx_id_published (id,published),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

