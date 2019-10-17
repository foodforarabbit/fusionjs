#!/usr/bin/env bash

echo "Verifying...";

# install
jazelle ci && jazelle build

TYPES=(
  website
  fusion-plugin
  library
)

for TYPE in ${TYPES[*]};
do 
  echo "Testing $TYPE"
  rm -rf test-project

  node dist/index.js scaffold \
  --type "$TYPE" \
  --name "test-project" \
  --description "my project" \
  --team web \
  --audience internal \
  --skip-install

  (
    cd test-project
    yarn --ignore-engines
    yarn --ignore-engines test && \
    yarn --ignore-engines lint && \
    yarn --ignore-engines flow
  )
  code=$?
  rm -rf test-project
  if [ $code -eq 0 ]
  then
    echo -e "$TYPE" "\033[0;32mOK\033[0m"
  else
    echo -e "$TYPE" "\033[0;31mFAILED\033[0m"
    exit 1
  fi
done

exit 0
