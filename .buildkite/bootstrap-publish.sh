echo "steps:"
echo "  - label: 'prepare publish'";
echo "    commands:";
echo "    - 'jazelle ci --cwd=private/monorepo-actions'";
echo "    - 'node private/monorepo-actions/plan-publish.js'";
echo "    - 'buildkite-agent artifact upload versioned_packages.json'";
echo "    timeout_in_minutes: 5";
echo "    plugins:";
echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':";
echo "        run: ci";
echo "        env:";
echo "          - BUILDKITE_AGENT_ACCESS_TOKEN"
echo "          - BUILDKITE_BUILD_ID"
echo "          - BUILDKITE_JOB_ID"
echo "          - UNPM_TOKEN";
echo "          - NPM_TOKEN";
echo "        volumes:"
echo "          - ${BUILDKITE_AGENT_BINARY_PATH:-/usr/bin/buildkite-agent}:/usr/bin/buildkite-agent"
echo "    agents:";
echo "      queue: private-default";
echo "  - wait"

PROJECTS=$(jq -r ".projects - .excludeFromPublishing | .[]" manifest.json)

for DIR in $PROJECTS ; do (
  PROJECT=$(basename "$DIR");
    echo "  - label: '$PROJECT'";
    echo "    commands:";
    echo "    - 'buildkite-agent artifact download versioned_packages.json .'";
    # Exit early if not publishing this package
    echo "    - 'jq -e \".\$(jq .name $DIR/package.json).publish\" versioned_packages.json || (echo \"skipping...\" && exit 0)'"
    echo "    - 'jazelle ci --cwd $DIR'";
    echo "    - 'jazelle build --cwd $DIR'";
    echo "    - 'node scripts/write-package-versions.js versioned_packages.json $DIR'";
    echo "    - 'cd $DIR'";
    echo "    - 'git --no-pager diff .'";
    echo "    - 'buildkite-agent artifact upload \$(npm pack)'";
    echo "    timeout_in_minutes: 10";
    echo "    agents:";
    echo "      queue: private-default";
    echo "    plugins:";
    echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':";
    echo "        run: ci";
    echo "        pull_retries: 5";
    echo "        env:"
    echo "          - BUILDKITE_AGENT_ACCESS_TOKEN"
    echo "          - BUILDKITE_BUILD_ID"
    echo "          - BUILDKITE_JOB_ID"
    echo "          - UNPM_TOKEN"
    echo "        volumes:"
    echo "          - ${BUILDKITE_AGENT_BINARY_PATH:-/usr/bin/buildkite-agent}:/usr/bin/buildkite-agent"
); done;

echo "  - wait"
echo "  - label: 'publish'";
echo "    commands:";
echo "    - 'jazelle ci --cwd=private/monorepo-actions'";
echo "    - 'buildkite-agent artifact download versioned_packages.json .'";
echo "    - 'buildkite-agent artifact download \"*.tgz\" .'";
echo "    - 'node private/monorepo-actions/publish.js'";
echo "    timeout_in_minutes: 20";
echo "    plugins:";
echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':";
echo "        run: ci";
echo "        env:"
echo "          - BUILDKITE_AGENT_ACCESS_TOKEN"
echo "          - BUILDKITE_BUILD_ID"
echo "          - BUILDKITE_JOB_ID"
echo "          - UNPM_TOKEN"
echo "          - NPM_TOKEN";
echo "        volumes:"
echo "          - ${BUILDKITE_AGENT_BINARY_PATH:-/usr/bin/buildkite-agent}:/usr/bin/buildkite-agent"
echo "    agents:";
echo "      queue: private-default";
