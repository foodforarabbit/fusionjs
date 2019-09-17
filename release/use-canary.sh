#!/usr/bin/env bash
# 
# Applies the specified fusion canary release to a package.json file.
#
# Inputs:
# - the desired canary release version
# - the path to a package.json file
#
# Example:
# ./use-canary 0.0.0-canary.109b061.0 ~/Documents/code/test-proj/package.json
#

CANARY_RELEASE=$1
PACKAGE_JSON=$2

# since our rush.json manifest is not standard json (has comments), we use the any-json library to parse it
if [ `npm list -g | grep -c any-json` -eq 0 ];
then
  npm install -g any-json
fi

function hasCanaryRelease() {
  local PKG=$1
  local CANARY_RELEASE=$2
  npm view "$PKG" versions 2> /dev/null | \
    tr "'" '"' | \
    jq -e --arg CANARY_RELEASE "$CANARY_RELEASE" 'contains([$CANARY_RELEASE])' > /dev/null
}

TMP=$(mktemp)
for PKG in $(any-json $PACKAGE_JSON | jq -r '(.dependencies + .devDependencies) | to_entries | .[] | .key')
do
  if hasCanaryRelease $PKG $CANARY_RELEASE; then
    echo "$PKG has $CANARY_RELEASE -- updating package.json"
    cat $PACKAGE_JSON | jq --arg PKG "$PKG" --arg CANARY_RELEASE "$CANARY_RELEASE" '.devDependencies=.devDependencies + (.devDependencies | to_entries | map(select(.key | match($PKG)) |= {"key": .key, "value": $CANARY_RELEASE}) | from_entries)' > $TMP && mv $TMP $PACKAGE_JSON
    cat $PACKAGE_JSON | jq --arg PKG "$PKG" --arg CANARY_RELEASE "$CANARY_RELEASE" '.dependencies=.dependencies + (.dependencies | to_entries | map(select(.key | match($PKG)) |= {"key": .key, "value": $CANARY_RELEASE}) | from_entries)' > $TMP && mv $TMP $PACKAGE_JSON
  fi
done
echo "Done!"
