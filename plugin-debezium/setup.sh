#!/bin/sh

WORKDIR=$(pwd)

folder_path="$WORKDIR/debezium-connector-mysql"

file_name="debezium-connector-mysql-2.5.0.Final-plugin.tar.gz"

expected_checksum="5dc9e008482f1d2f1e316922be068719003d862d"


if [ -d "$folder_path" ]; then
    echo "Debezium connector folder exists."
else
    echo "Debezium connector folder does not exist."
    curl -o $file_name https://repo1.maven.org/maven2/io/debezium/debezium-connector-mysql/2.5.0.Final/$file_name
    tar -xzf $file_name
fi



actual_checksum=$(sha1sum $file_name | awk '{print $1}')

echo $actual_checksum

if [ "$actual_checksum" = "$expected_checksum" ]; then
    echo "Checksums match. File integrity verified."
else
    echo "Checksums do not match. File integrity compromised."
    rm -rf $folder_path
fi






