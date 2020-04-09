PROJECTS=$(jq -r ".projects - .excludeFromPublishing | .[]" manifest.json)
ROOTDIR=$(pwd)

echo "steps:"

for DIR in $PROJECTS ; do (
  PROJECT=$(basename "$DIR");
    echo "  - label: '$PROJECT'";
    echo "    commands:";
    echo "    - 'cd $DIR'";
    echo "    - '../../.buildkite/prepublish-install.sh'";
    echo "    - 'npm pack --ignore-scripts --json > pack_stdout.txt'";
    echo "    - 'cat pack_stdout.txt'";
    echo "    - 'cat pack_stdout.txt | jq \".[0].shasum\" > \$(jq -rj .name package.json | jq -s -R -r @uri)-shasum.json'";
    echo "    - 'buildkite-agent artifact upload \$(jq -rj .name package.json | jq -s -R -r @uri)-shasum.json'";
    echo "    timeout_in_minutes: 10";
    echo "    agents:";
    echo "      queue: private-default";
    echo "    plugins:";
    echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':";
    echo "        run: ci";
    echo "        pull_retries: 5";
    echo "        args:"
    echo "          - UNPM_TOKEN=$UNPM_TOKEN"
    echo "        env:"
    echo "          - BUILDKITE_AGENT_ACCESS_TOKEN"
    echo "          - BUILDKITE_BUILD_ID"
    echo "          - BUILDKITE_JOB_ID"
    echo "          - UNPM_TOKEN"
    echo "          - NPM_TOKEN";
    echo "        volumes:"
    echo "          - ${BUILDKITE_AGENT_BINARY_PATH:-/usr/bin/buildkite-agent}:/usr/bin/buildkite-agent"
); done;

echo "  - wait"
echo "  - label: ':pipeline: report tarball hashes'"
echo "    timeout_in_minutes: 5"
echo "    commands:";
echo "    - 'echo ok'";
echo "    - 'buildkite-agent artifact download \"*-shasum.json\" .'";
echo "    - 'cd .buildkite/report-hashes'";
echo "    - 'npm ci'";
echo "    - 'cd ../..'";
echo "    - 'node .buildkite/report-hashes/index.js'";
echo "    plugins:"
echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':"
echo "        run: ci"
echo "        args:"
echo "          - UNPM_TOKEN=$UNPM_TOKEN"
echo "        env:"
echo "          - BUILDKITE_AGENT_ACCESS_TOKEN"
echo "          - BUILDKITE_BUILD_ID"
echo "          - BUILDKITE_JOB_ID"
echo "          - UNPM_TOKEN"
echo "          - NPM_TOKEN";
echo "        volumes:"
echo "          - ${BUILDKITE_AGENT_BINARY_PATH:-/usr/bin/buildkite-agent}:/usr/bin/buildkite-agent"
echo "    agents:"
echo "      queue: private-default"
