yarn upgrade --latest;
for d in ./templates/*/ ; do (
  cd "$d";
  yarn install --silent --ignore-scripts;
  yarn upgrade --latest;
  rm -rf node_modules;
  rm -rf dist;
  rm -f yarn-error.log;
); done