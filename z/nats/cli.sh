# https://github.com/nats-io/natscli/releases

nats context add local --server http://localhost:4222

nats context select local

nats stream ls

nats stream delete product #delete stream

nats consumer ls mystream

nats consumer info product service-gateway-consumer

nats consumer delete product service-gateway-consumer

