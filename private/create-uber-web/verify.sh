echo "Verifying...";
for d in ./templates/*/ ; do (
  cd "$d";
  yarn >/dev/null 2>/dev/null;
  yarn test >/dev/null 2>/dev/null &&
  yarn lint >/dev/null 2>/dev/null &&
  yarn flow >/dev/null 2>/dev/null &&
  echo -e "$d \033[0;32mOK\033[0m" ||
  echo -e "$d \033[0;31mFAILED\033[0m" && exit 1;
  rm -rf node_modules;
  rm -rf dist;
  rm -f yarn-error.log;
  rm -rf .fusion;
); done
exit 0;