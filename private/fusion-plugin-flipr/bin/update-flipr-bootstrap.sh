#!/bin/bash
BOXER_DEFAULT_PATH="$UBER_HOME/docker-stuff/var/cache/flipr-config"
FLIPR_BOOTSTRIP_FILE_SAVE_PATH="flipr"

if [ -z "$1" ]; then
  echo "Please provide the Flipr namespace. For example, \`update-flipr-bootstrap my-awesome-app\`"
  exit 1
fi

if [ ! -e 'package.json' ]; then
  echo "Cannot find "package.json". Make sure this is the root dir of your app."
  exit 1
fi

# Create flipr directory
if [ ! -e $FLIPR_BOOTSTRIP_FILE_SAVE_PATH ]; then
  mkdir $FLIPR_BOOTSTRIP_FILE_SAVE_PATH
fi

echo "Starting Cerberus tunnel (Step 1/4)"
if [ -x "$(command -v cerberus)" ]; then
  cerberus --no-status-page --quiet -s flipr&
  CERBERUS_PID=$!
else
  echo "Cerberus not found!"
  exit 1
fi
sleep 15

echo -e "Downloading Flipr bootstrap files (Step 2/4)\n"
boxer docker_flipr $1
sleep 5
echo -e "\nDone retrieving Flipr bootstrap files.\n"

echo "Copy from the default path (Step 3/4)"
cp -r $BOXER_DEFAULT_PATH/$1.json $FLIPR_BOOTSTRIP_FILE_SAVE_PATH/$1_flipr_bootstrap.json

echo "killing Cerberus... (Step 4/4)"
kill $CERBERUS_PID
