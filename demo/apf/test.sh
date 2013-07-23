#!/bin/sh
# first

for file in *
do
  if grep -q require $file
  then
  echo $file
  fi
done

exit 0
