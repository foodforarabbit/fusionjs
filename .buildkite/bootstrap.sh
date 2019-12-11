echo "steps:"
echo "  - wait"

SHA1="HEAD"
if [ "$BUILDKITE_PULL_REQUEST" = "false" ]; then
  # master commits compare HEAD with HEAD~1
  SHA2="HEAD~1"
else
  # pull requests compare HEAD with latest master
  SHA2="origin/master"
fi

# Get the change set
git diff-tree --no-commit-id --name-only -r $SHA1 $SHA2 | grep -v "\.md$" > changes.txt
CHANGES=$(jazelle changes ./changes.txt)

for DIR in $CHANGES ; do (
  PROJECT=$(basename "$DIR");
  if [ -d "$DIR" ] && [ $PROJECT != "common" ] && [ $PROJECT != "scripts" ] && [ $PROJECT != "flow-typed" ] && [ $PROJECT != "rfcs" ] && [ $PROJECT != "docs" ]; then
    if [ $PROJECT = "fusion-cli" ]; then
      echo "  - label: 'fusion-cli'";
      echo "    commands:";
      echo "    - 'cd public/fusion-cli'";
      echo "    - 'jazelle ci'";
      echo "    - 'jazelle build'";
      echo "    - '.buildkite/nodeTests'";
      echo "    parallelism: 10";
      echo "    timeout_in_minutes: 10";
      echo "    plugins:";
      echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':";
      echo "        run: ci";
      echo "        pull_retries: 5";
      echo "        env:";
      echo "          - UNPM_TOKEN";
      echo "    agents:";
      echo "      queue: private-default";
      echo "  - label: 'fusion-cli lint flow'";
      echo "    commands:";
      echo "    - 'jazelle ci --cwd $DIR'";
      echo "    - 'jazelle build --cwd $DIR'";
      echo "    - 'jazelle lint --cwd $DIR'";
      echo "    - 'jazelle flow --cwd $DIR'";
      echo "    timeout_in_minutes: 10";
      echo "    plugins:";
      echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':";
      echo "        run: ci";
      echo "        pull_retries: 5";
      echo "        env:";
      echo "          - UNPM_TOKEN";
      echo "    agents:";
      echo "      queue: private-default";
    else
      echo "  - label: '$PROJECT'";
      echo "    commands:";
      echo "    - 'jazelle ci --cwd $DIR'";
      echo "    - 'jazelle build --cwd $DIR'";
      echo "    - 'jazelle test --cwd $DIR'";
      echo "    - 'jazelle lint --cwd $DIR'";
      echo "    - 'jazelle flow --cwd $DIR'";
      echo "    timeout_in_minutes: 15";
      echo "    plugins:";
      echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':";
      echo "        run: ci";
      echo "        pull_retries: 5";
      echo "        env:";
      echo "          - UNPM_TOKEN";
      echo "    agents:";
      echo "      queue: private-default";
    fi;
  fi;
); done;

echo "  - label: 'calculate package hashes'";
echo "    command: jazelle ci --cwd=private/monorepo-actions && node private/monorepo-actions/calculate-package-hashes.js";
echo "    timeout_in_minutes: 5";
echo "    plugins:";
echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':";
echo "        run: ci";
echo "        env:";
echo "          - UNPM_TOKEN";
echo "          - NPM_TOKEN";
echo "    agents:";
echo "      queue: private-default";
