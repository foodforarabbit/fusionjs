yarn build
for d in ./templates/*/ ; do (
  cd "$d";
  echo "Upgrading $d";
  yarn;
  node ../../dist/cli upgrade --force
  yarn test;
  rm -rf node_modules;
  rm -rf dist;
  rm -f yarn-error.log;
  cp .gitignore dotgitignore
); done
node dist/cli upgrade --force
npm version patch --no-git-tag-version