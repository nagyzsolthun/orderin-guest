#!/bin/bash
VERSION=$1
if [ $(aws s3 ls orderin-ui-guest/$VERSION/guest/ | wc -l) -gt 0 ]; then
  echo "$VERSION already deployed";
else
  ng build --prod --configuration production
  aws s3 cp dist/orderin-guest s3://orderin-ui-guest/$VERSION/guest --recursive
fi