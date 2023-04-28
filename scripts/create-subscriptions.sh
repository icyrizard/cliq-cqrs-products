#!/bin/bash

curl -L -X PUT "http://localhost:2113/subscriptions/%24svc-product/product" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46Y2hhbmdlaXQ=" \
  -d "{}"