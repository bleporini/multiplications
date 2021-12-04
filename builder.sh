#!/usr/bin/env bash

docker run -ti --rm -v $(pwd):/work -p 3000:3000  --workdir /work node:14.18.2 "$@"