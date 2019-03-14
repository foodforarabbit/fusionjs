yarn
yarn build
for d in ./templates/*/ ; do (
  cd "$d";
  echo "Upgrading $d";
  yarn;
  npm rebuild;
  if [ "$d" = "./templates/website/" ]; then
    node ../../dist/index upgrade --strategy=default
  else
    node ../../dist/index upgrade --strategy=default --codemod false
  fi
  cp .gitignore dotgitignore
); done
node dist/index upgrade --strategy=default --codemod false
clear
./verify.sh && npm version patch --no-git-tag-version
