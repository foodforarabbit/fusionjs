yarn
yarn build
for d in ./templates/*/ ; do (
  cd "$d";
  echo "Upgrading $d";
  yarn;
  npm rebuild;
  if [ "$d" = "./templates/website/" ]; then
    node ../../dist/index upgrade
  else
    node ../../dist/index upgrade --match ".*" --codemod false
  fi
  cp .gitignore dotgitignore
); done
node dist/index upgrade --match ".*" --codemod false
clear
./verify.sh && npm version patch --no-git-tag-version
