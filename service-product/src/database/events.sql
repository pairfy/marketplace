create table if not exists events(
  id varchar(100) not null,
  source varchar(50) not null,
  type varchar(100) not null,
  published boolean default false,
  data mediumtext not null,
  agent_id varchar(200) default null,
  spec_version int unsigned not null,
  created_at timestamp default current_timestamp,
  primary key(id),
  INDEX idx_id_published (id,published),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

