#!/bin/ash
# shellcheck shell=dash

i=0
while [ "$i" -lt 21 ]
do 
  cd /sys/class/thermal/ && cd thermal_zone$((i+1)) && cat temp
  i=$((i+1))
done