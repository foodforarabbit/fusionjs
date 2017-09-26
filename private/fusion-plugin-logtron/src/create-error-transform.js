import util from 'util';
import fs from "fs";
import path from "path";
import sourcemap from "source-map";
import ErrorStackParser from "error-stack-parser";

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

export default function createErrorTransform(config) {
  const mappers = await loadSourceMaps(config);

  return function parseError(data) {
    const { message, source, line, col, error } = data;

    let parsed;
    if (error && error.stack) {
      // Newer browsers send the error object
      parsed = handleErrorObject(error);
    } else if (line) {
      if (col) {
        // Older browsers send line and column
        parsed = handleLineAndCol(message, source, line, col);
      } else {
        // Oldest browsers only include message, source, and line
        parsed = {
          message,
          source,
          line
        };
      }
    } else {
      // can't transform, early return to continue
      return data;
    }

    // TODO: Maybe include a newline at the beginning of the stack for better readability
    parsed.stack = parsed.stack
      ? parsed.stack.trim()
      : `${parsed.message}\n    at ${parsed.source}:${parsed.line}`;

    return parsed;
  };

  function applySourceMap(fileName, line, column) {
    const map = mappers[path.basename(fileName)];
    return map ? map.originalPositionFor({ line, column }) : null;
  }

  // Returns log for older browsers that don't send the entire error object
  function handleLineAndCol(message, source, line, col) {
    const mapped = applySourceMap(source, line, col);

    // Couldn't find sourcemap, using raw data instead
    if (!mapped) {
      return {
        message,
        source,
        line,
        col
      };
    }

    const name = mapped.name || "unknown function name";

    return {
      message: message,
      stack: `${name} at ${mapped.source}:${mapped.line}:${mapped.column}`
    };
  }

  // Returns log data for browsers that send the entire error object
  function handleErrorObject(error) {
    const frames = ErrorStackParser.parse(error)
      .map(frame => {
        // things that we can't resolve a stack trace to
        if (!frame.fileName || !frame.lineNumber || !frame.columnNumber) {
          return frame.source || null;
        }

        const mapped =
          applySourceMap(
            frame.fileName,
            frame.lineNumber,
            frame.columnNumber
          ) || {};

        const functionName = mapped.name || frame.functionName;
        const fileName = mapped.source || frame.fileName;
        const line = mapped.line || frame.lineNumber;
        const column = mapped.column || frame.columnNumber;

        return `${functionName} at ${fileName}:${line}:${column}`;
      })
      .filter(Boolean);

    // Extra \n at the beginning lines up the stack
    const stackString = `\n${frames.join("\n    ")}`;
    const logMeta = {
      message: error.message,
      stack: stackString
        .replace(/(js)(\?.+)$/gm, "$1")
        .replace(/webpack:\/\/\//g, "./")
        .replace(/~\//g, "node_modules/")
    };
    return logMeta;
  }
}

async function loadSourceMaps(config) {
  const mappers = {};

  try {
    const paths = await readDir(config.path)
    const maps = paths
      .filter(fName => fName.endsWith(config.ext))
      .map(toSourceMapper);
    (await Promise.all(maps)).forEach(map => {
      mappers[name] = map
    });
  } catch (e) {
    const wrappedError = new Error(
      `Failed to read sourcemaps from ${config.path}`
    );
    wrappedError.originalError = e;
    throw wrappedError;
  }
  return mappers;

  async function toSourceMapper(maps, fName) {
    const jsName = path.basename(fName, config.ext);
    const fullFname = path.join(config.path, fName);
    const sourceMapConents = await readFile(fullFname, "utf8");
    return {name: jsName, map: new sourcemap.SourceMapConsumer(sourceMapConents)}
  }
}
