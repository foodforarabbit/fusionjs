#!/usr/bin/env bash
# 
# Scaffolds a website and website-graphql app and runs tests.
#
# Inputs:
# - the specified canary release of @uber/create-uber-web
# - the directory you want to scaffold into
#
# Example:
# ./release/smoke-test-scaffold.sh 0.0.0-canary.109b061.0
#
set -e

VERSION=$1
if [ -n "$VERSION" ]; then
  yarn global add "@uber/create-uber-web@${VERSION}"
fi
TEST_DIR=$(mktemp -d)

echo "...Testing website scaffold..."
cd "${TEST_DIR}"
uber-web scaffold \
  --type=website \
  --name=test-proj \
  --description="Test Fusion.js project" \
  --team=web \
  --audience=internal \
  --skip-install
yarn --cwd=test-proj && \
yarn --cwd=test-proj lint && \
yarn --cwd=test-proj flow && \
yarn --cwd=test-proj test && \
yarn --cwd=test-proj build
rm -rf test-proj

echo "...Testing website-graphql scaffold..."
cd "${TEST_DIR}"
uber-web scaffold \
  --type=website-graphql \
  --name=test-proj \
  --description="Test Fusion.js graphql project" \
  --team=web \
  --audience=internal \
  --skip-install
yarn --cwd=test-proj && \
yarn --cwd=test-proj lint && \
yarn --cwd=test-proj flow && \
yarn --cwd=test-proj test && \
yarn --cwd=test-proj build
rm -rf test-proj
