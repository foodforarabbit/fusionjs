#!/bin/bash
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
  echo "Created $FLIPR_BOOTSTRIP_FILE_SAVE_PATH/ directory to hold flipr config files"
fi

echo "Starting Cerberus tunnel; this may take awhile, please wait... (Step 1/3)"
if [ -x "$(command -v cerberus)" ]; then
  cerberus --no-status-page --quiet -s flipr&
  CERBERUS_PID=$!
else
  echo "Cerberus not found!"
  exit 1
fi
sleep 60

echo -e "Downloading Flipr bootstrap file... (Step 2/3)\n"
curl -H "x-uber-source:flipr" "localhost:14570/properties?namespaces=$1" | jq . > "$FLIPR_BOOTSTRIP_FILE_SAVE_PATH/$1_flipr_bootstrap.json"
echo -e "\nDone retrieving Flipr bootstrap file."

echo "Done! Killing Cerberus... (Step 3/3)"
kill $CERBERUS_PID
