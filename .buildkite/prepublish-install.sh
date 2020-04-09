set -ex

if jq -e '.scripts.prepublish' package.json; then
  cp package.json package.json.copy
  # Remove all dependencies not used in prepublish script
  # (based on a heuristic)
  jq '.peerDependencies = {} | .dependencies = {} | .devDependencies = (.devDependencies | with_entries(select(.key | . == "create-universal-package" or ((startswith("@babel/") or startswith("babel-")) and ((contains("istanbul") or contains("eslint")) | not)))))' package.json.copy > package.json
  yarn install --frozen-lockfile
  # Put back original package.json so shasum is accurate
  mv package.json.copy package.json
fi;
