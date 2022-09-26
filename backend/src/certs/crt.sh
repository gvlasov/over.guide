#!/bin/bash
set -xe
#openssl genrsa -out "ca.key" 2048
#openssl genrsa -out "server.key" 2048
#openssl req -new -days 3650 -nodes -x509 -subj "/C=US/ST=Oklahoma/L=Stillwater/O=My Company/OU=Engineering/CN=test.com" -keyout ca.key -out ca.crt
openssl req -new -key server.key -out server.csr -subj "/CN=localhost"
openssl x509 -req -days 3650 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -extensions v3_req -extfile openssl.cnf -out server.crt
#openssl x509 -inform PEM -out`form DER -in server.crt -out server.der.crt
sudo trust anchor --store ca.crt
sudo update-ca-trust
openssl verify -CAfile ca.crt server.crt
openssl x509 -in server.crt -text -noout | grep localhost
openssl x509 -in ca.crt -text -noout | grep test.com
