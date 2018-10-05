yarn build
for d in ./templates/*/ ; do (
  cd "$d";
  node ../../dist/cli upgrade
  yarn test;
  rm -rf node_modules;
  rm -rf dist;
  rm -f yarn-error.log;
  cp .gitignore dotgitignore
); done
node dist/cli upgrade
npm version patch --no-git-tag-version