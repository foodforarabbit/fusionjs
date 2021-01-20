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
CHANGES=$(jazelle changes --format dirs ./changes.txt)

echo "  - label: 'calculate tarball hashes'";
echo "    commands:";
echo "    - 'echo ok'";
echo "    - 'cd .buildkite/report-hashes'";
echo "    - 'npm ci'";
echo "    - 'cd ../..'";
echo "    - 'node .buildkite/report-hashes/index.js'";
echo "    timeout_in_minutes: 15";
echo "    plugins:";
echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':";
echo "        run: ci";
echo "        pull_retries: 5";
echo "        env:";
echo "          - BUILDKITE_AGENT_ACCESS_TOKEN"
echo "          - BUILDKITE_BUILD_ID"
echo "          - BUILDKITE_JOB_ID"
echo "          - UNPM_TOKEN"
echo "          - NPM_TOKEN";
echo "    agents:";
echo "      queue: private-default";

echo "  - label: 'flow'";
echo "    commands:";
echo "    - 'yarn flow --show-all-errors'";
echo "    timeout_in_minutes: 15";
echo "    plugins:";
echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':";
echo "        run: ci";
echo "        pull_retries: 5";
echo "        env:";
echo "          - UNPM_TOKEN";
echo "    agents:";
echo "      queue: private-default";

for DIR in $CHANGES ; do (
  PROJECT=$(basename "$DIR");
  if [ -d "$DIR" ] && [ $PROJECT != "common" ] && [ $PROJECT != "scripts" ] && [ $PROJECT != "flow-typed" ] && [ $PROJECT != "rfcs" ] && [ $PROJECT != "docs" ]; then
    if [ $PROJECT = "fusion-cli-tests" ]; then
      echo "  - label: 'fusion-cli-tests'";
      echo "    commands:";
      echo "    - 'cd public/fusion-cli-tests'";
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
      echo "  - label: 'fusion-cli-tests lint flow'";
      echo "    commands:";
      echo "    - 'cd $DIR'";
      echo "    - 'yarn lint'";
      echo "    - 'yarn flow'";
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
      echo "    - 'cd $DIR'";
      echo "    - 'yarn test'";
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
