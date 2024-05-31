#!/bin/sh

alias vtctldclient="vtctldclient --server=localhost:15999"
alias mysql="mysql -h 127.0.0.1 -P 15306 -u marketplace -ppassword"



vtctldclient ApplySchema --sql-file="service-seller/src/sql/seller.sql" service_seller
vtctldclient ApplyVSchema --vschema-file="service-seller/src/sql/seller.json" service_seller


vtctldclient ApplySchema --sql-file="service-product/src/sql/product.sql" service_product
vtctldclient ApplyVSchema --vschema-file="service-product/src/sql/product.json" service_product


vtctldclient ApplySchema --sql-file="service-gate/src/sql/product.sql" service_gate
vtctldclient ApplyVSchema --vschema-file="service-gate/src/sql/product.json" service_gate


vtctldclient ApplySchema --sql-file="service-gate/src/sql/slot.sql" service_gate
vtctldclient ApplyVSchema --vschema-file="service-gate/src/sql/slot.json" service_gate


vtctldclient ApplySchema --sql-file="service-media/src/sql/media.sql" service_media
vtctldclient ApplyVSchema --vschema-file="service-media/src/sql/media.json" service_media