// @flow
import fs from 'fs';
import path from 'path';
import sourcemap from 'source-map';
import ErrorStackParser from 'error-stack-parser';
import type {PayloadMetaType} from './types.js';

type ConfigType = {
  path: string,
  ext: string,
};

export default function createErrorTransform(config: ConfigType) {
  const mappers = loadSourceMaps(config);

  return async function parseError(data: PayloadMetaType) {
    const {message, source, line, col, error} = data;

    let parsed: {source?: string, stack?: string, line?: string};
    if (error && error.stack) {
      // Newer browsers send the error object
      parsed = await handleErrorObject(error);
    } else if (line) {
      if (col) {
        // Older browsers send line and column
        parsed = await handleLineAndCol(message, source, line, col);
      } else {
        // Oldest browsers only include message, source, and line
        parsed = {
          message,
          source,
          line,
        };
      }
    } else {
      // can't transform, early return to continue
      return data;
    }

    // TODO: Maybe include a newline at the beginning of the stack for better readability
    parsed.stack = parsed.stack
      ? parsed.stack.trim()
      : `${String(parsed.message)}\n    at ${String(parsed.source)}:${String(
          parsed.line
        )}`;

    return parsed;
  };

  async function applySourceMap(fileName, line, column) {
    const map = await mappers[path.basename(String(fileName))];
    return map ? map.originalPositionFor({line, column}) : null;
  }

  // Returns log for older browsers that don't send the entire error object
  async function handleLineAndCol(message, source, line, col) {
    const mapped = await applySourceMap(source, line, col);

    // Couldn't find sourcemap, using raw data instead
    if (!mapped) {
      return {
        message,
        source,
        line,
        col,
      };
    }

    const name = mapped.name || 'unknown function name';

    return {
      message: message,
      stack: `${name} at ${mapped.source}:${mapped.line}:${mapped.column}`,
    };
  }

  // Returns log data for browsers that send the entire error object
  async function handleErrorObject(error) {
    const frames = (
      await Promise.all(
        ErrorStackParser.parse(error).map(async frame => {
          // things that we can't resolve a stack trace to
          if (!frame.fileName || !frame.lineNumber || !frame.columnNumber) {
            return frame.source || null;
          }

          const mapped =
            (await applySourceMap(
              frame.fileName,
              frame.lineNumber,
              frame.columnNumber
            )) || {};

          const functionName = mapped.name || frame.functionName;
          const fileName = mapped.source || frame.fileName;
          const line = mapped.line || frame.lineNumber;
          const column = mapped.column || frame.columnNumber;

          return `${functionName} at ${fileName}:${line}:${column}`;
        })
      )
    ).filter(Boolean);

    // Extra \n at the beginning lines up the stack
    const stackString = `\n${frames.join('\n    ')}`;
    const logMeta = {
      message: error.message,
      stack: stackString
        .replace(/(js)(\?.+)$/gm, '$1')
        .replace(/webpack:\/\/\//g, './')
        .replace(/~\//g, 'node_modules/'),
    };
    return logMeta;
  }
}

function loadSourceMaps(config) {
  const mappers = {};

  try {
    fs.readdirSync(config.path)
      .filter(fName => fName.endsWith(config.ext))
      .reduce(toSourceMapper, mappers);
  } catch (e) {
    // If this fails, something is broken so we should throw.
    const wrappedError = new Error(
      `Failed to read sourcemaps from ${config.path}`
    );
    // $FlowFixMe
    wrappedError.originalError = e;
    throw wrappedError;
  }
  return mappers;

  function toSourceMapper(maps, fName) {
    const jsName = path.basename(fName, config.ext);
    const fullFname = path.join(config.path, fName);
    const sourceMapConents = fs.readFileSync(fullFname, 'utf8');
    maps[jsName] = new sourcemap.SourceMapConsumer(sourceMapConents);
    return maps;
  }
}
