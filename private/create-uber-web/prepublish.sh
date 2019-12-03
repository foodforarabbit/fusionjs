# It is assumed that the versions in template package.json are already set

set -ex

for template in "template-fusion-plugin" "template-library" "template-website" "template-website-graphql"; do (
  echo "Copying $template";

  # Copy templates, but skip gitignored files
  git read-tree -u --prefix "private/create-uber-web/templates/$template" $(git rev-parse "HEAD:private/$template")

  # Overwrite template package.json with versioned package.json
  cp "../$template/package.json" "templates/$template"

  # Overwrite template yarn.lock with synthesized yarn.lock
  cp "../$template/yarn.lock" "templates/$template"

  cd "templates/$template"

  # Make npm publish-ready

  # Apparently, nested package.json "files" fields will affect npm when packing
  # Rename to __files prior to publish, which will be undone by scaffold codemod
  jq 'with_entries( if .key == "files" then .key |= "__files" else . end)' package.json > __package.json;
  mv __package.json package.json

  # npm ignores .gitignore file
  # Rename to dotigignore prior to publish, which will be undone by scaffold codemod
  mv .gitignore dotgitignore

  sed '/# BEGIN REMOVE BEFORE PUBLISH/,/# END REMOVE BEFORE PUBLISH/d' .flowconfig > __flowconfig

  mv __flowconfig .flowconfig

); done
