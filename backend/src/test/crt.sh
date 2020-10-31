#!/bin/bash
openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 -subj "/C=US/ST=Oklahoma/L=Stillwater/O=My Company/OU=Engineering/CN=test.com" -keyout ca.key -out ca.crt
openssl genrsa -out "server.key" 2048
openssl req -new -key server.key -out server.csr -config openssl.cnf
openssl x509 -req -days 3650 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -extensions v3_req -extfile openssl.cnf -out server.crt
openssl x509 -inform PEM -outform DER -in server.crt -out server.der.crt