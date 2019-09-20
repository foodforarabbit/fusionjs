SANITIZED_BRANCH=${BUILDKITE_BRANCH//[^a-zA-Z0-9_\.-]/}

echo "steps:"
echo "  - label: ':yarn:'"
echo "    timeout_in_minutes: 5"
echo "    commands:"
echo "      - '.buildkite/generate-package-files.sh'"
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
echo "        volumes:"
echo "          - ${BUILDKITE_AGENT_BINARY_PATH:-/usr/bin/buildkite-agent}:/usr/bin/buildkite-agent"
echo "    agents:"
echo "      queue: private-builders"
echo "  - wait"
echo "  - label: ':docker:'"
echo "    timeout_in_minutes: 20"
echo "    plugins:"
echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':"
echo "        pre-build-command: '.buildkite/install-cache.sh'"
echo "        build: ci"
echo "        cache-from:"
echo "          - ci:027047743804.dkr.ecr.us-east-2.amazonaws.com/uber:$SANITIZED_BRANCH"
echo "          - ci:027047743804.dkr.ecr.us-east-2.amazonaws.com/uber:master"
echo "        image-repository: 027047743804.dkr.ecr.us-east-2.amazonaws.com/uber"
echo "        args:"
echo "          - UNPM_TOKEN=$UNPM_TOKEN"
echo "    agents:"
echo "      queue: private-builders"
echo "  - wait"
echo "  - label: ':rocket:'"
echo "    timeout_in_minutes: 5"
echo "    plugins:"
echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':"
echo "        push: ci:027047743804.dkr.ecr.us-east-2.amazonaws.com/uber:$SANITIZED_BRANCH"
echo "    agents:"
echo "      queue: private-builders"
echo "  - wait"
echo "  - label: ':pipeline:'"
echo "    timeout_in_minutes: 5"
echo "    command: .buildkite/bootstrap-publish.sh | buildkite-agent pipeline upload"
echo "    plugins:"
echo "      'derekju/docker-compose#1346e78909a17f800064a37e7dfb716200d514a4':"
echo "        run: ci"
echo "        env:"
echo "          - BUILDKITE_AGENT_ACCESS_TOKEN"
echo "          - BUILDKITE_BUILD_ID"
echo "          - BUILDKITE_JOB_ID"
echo "          - UNPM_TOKEN"
echo "        volumes:"
echo "          - ${BUILDKITE_AGENT_BINARY_PATH:-/usr/bin/buildkite-agent}:/usr/bin/buildkite-agent"
echo "    agents:"
echo "      queue: private-default"