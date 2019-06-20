// @flow
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);

const main = `// @flow
    import root from './root.js';

    export default () => {
      const app = new App(root);
      return app;
    };`;

async function generate_test_fixture(
  num_files /*:number*/,
  path_to_output /*:string*/,
  node_depth /*:number*/,
  width /*:number*/
) {
  // make the directories
  fs.mkdirSync(path.join(path_to_output, "src", "pages"), { recursive: true });

  let promises = [];

  promises.push(writeFile(path.join(path_to_output, "src", "main.js"), main));
  console.log("main js file saved");

  let route_strings = "",
    import_strings = "";

  // build the string for root.js
  for (let i = 0; i < num_files; i++) {
    route_strings += `<Route exact path="/Home${i}" component={Home${i}} />\n`;
    import_strings += `import Home${i} from './pages/home${i}.js';\n`;
  }

  const root = `// @flow
    ${import_strings}
    const root = () => {
      <Switch>
      ${route_strings}
      </Switch>
    };
    export default root;`;

  promises.push(writeFile(path.join(path_to_output, "src", "root.js"), root));
  console.log("root js file saved");

  // generate the nodes for the home pages
  let home = "",
    nodes = generate_nodes(node_depth, width);
  for (let i = 0; i < num_files; i++) {
    home = `// @flow
    const Home${i} = () => (
      <FullHeightDiv>
        <Center>
            ${nodes}
        </Center>
      </FullHeightDiv>
    );
    export default Home${i};`;

    promises.push(
      writeFile(path.join(path_to_output, "src", "pages", `home${i}.js`), home)
    );
  }
  console.log("Files saved");
}

async function modify_test_fixture(
  file_number_to_modify /*:number*/,
  path_to_output /*:string*/,
  node_depth /*:number*/,
  width /*:number*/
) {
  const nodes = generate_nodes(node_depth, width);

  const home = `// @flow
    const Home${file_number_to_modify} = () => (
      <FullHeightDiv>
      <Center>
          ${Math.random().toString(36)}
          ${nodes}
      </Center>
    </FullHeightDiv>
    );
    export default Home${file_number_to_modify};`;

  await writeFile(
    path.join(
      path_to_output,
      "src",
      "pages",
      `home${file_number_to_modify}.js`
    ),
    home
  );
}

function generate_nodes(depth /*:number*/, width /*:number*/) {
  let nodes = "";
  for (let i = 0; i < depth; i++) {
    nodes += "<E>";
    for (let i = 0; i < width; i++) {
      nodes += "<E></E>";
    }
  }
  for (let i = 0; i < depth; i++) {
    nodes += "</E>";
  }
  return nodes;
}
module.exports = {
  generate_test_fixture,
  modify_test_fixture,
};
