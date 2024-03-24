FROM quay.io/strimzi/kafka:0.39.0-kafka-3.6.1
USER root:root
RUN mkdir -p /opt/kafka/plugins/debezium
COPY ./debezium-connector-mysql/ /opt/kafka/plugins/debezium/
USER 1001


