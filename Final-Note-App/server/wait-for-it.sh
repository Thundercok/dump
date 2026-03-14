#!/bin/sh
# Simple wait-for-it script for Alpine Linux

host="$1"
port="${host#*:}"
host_only="${host%:*}"
shift
cmd="$@"

until nc -z "$host_only" "$port"; do
  echo "waiting for $host..."
  sleep 3
done

echo "$host is available"
exec $cmd
