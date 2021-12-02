#!/usr/bin/env bash

docker run -ti --rm -v $(pwd):/work -p 3000:3000  --workdir /work node:17.1.0 "$@"