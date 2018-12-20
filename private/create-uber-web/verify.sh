for d in ./templates/*/ ; do (
  cd "$d";
  yarn >/dev/null 2>/dev/null;
  yarn test >/dev/null 2>/dev/null &&
  yarn lint >/dev/null 2>/dev/null &&
  yarn flow >/dev/null 2>/dev/null &&
  echo "$d OK";
  rm -rf node_modules;
  rm -rf dist;
  rm -f yarn-error.log;
); done