yarn build
for d in ./templates/*/ ; do (
  cd "$d";
  echo "Upgrading $d";
  yarn;
  npm rebuild;
  if [ "$d" = "./templates/website/" ]; then
    node ../../dist/cli upgrade --force
  else
    node ../../dist/cli upgrade --force --codemod false
  fi
  yarn test;
  rm -rf node_modules;
  rm -rf dist;
  rm -f yarn-error.log;
  cp .gitignore dotgitignore
); done
node dist/cli upgrade --force --codemod false
npm version patch --no-git-tag-version