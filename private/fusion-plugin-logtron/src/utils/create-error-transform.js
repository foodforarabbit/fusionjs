// @flow
import fs from 'fs';
import path from 'path';
import sourcemap from 'source-map';
import ErrorStackParser from 'error-stack-parser';

import type {PayloadMetaType} from '../types';

type ConfigType = {
  path: string,
  ext: string,
};

export default function createErrorTransform(config: ConfigType = {}) {
  const mappers = config.path && config.ext ? loadSourceMaps(config) : null;

  return async function parseError(data: PayloadMetaType) {
    const {message, source, line, col, error} = data;
    // TODO: message should just be string but Flow...  ¯\_(ツ)_/¯
    let parsedError: ?{
      message?: string,
      source?: string,
      stack?: string,
      line?: number,
    };
    if (error && error.stack) {
      // Newer browsers send the error object
      parsedError = await handleErrorObject(error);
    } else if (source && line) {
      // Older browsers send only source, line and maybe column
      parsedError = await handleSourceAndLine(
        String(message),
        source,
        line,
        col
      );
    }
    if (!parsedError) {
      // can't transform, early return
      // TODO: should we hoist nested error properties?
      return data;
    }

    if (parsedError.stack) {
      parsedError.stack = parsedError.stack.trim();
    }

    return parsedError;
  };

  async function applySourceMap(fileName, line, column) {
    const map = mappers ? await mappers[path.basename(String(fileName))] : null;
    return map ? map.originalPositionFor({line, column}) : null;
  }

  // Returns log for older browsers that don't send the entire error object
  async function handleSourceAndLine(message, source, line, col) {
    const mapped = await applySourceMap(source, line, col);

    const name = mapped && mapped.name ? mapped.name : 'unknown function name';
    source = mapped ? mapped.source : source;
    line = mapped ? mapped.line : line;
    col = (mapped ? mapped.column : col) || '';

    return {
      message: message,
      stack: `${name} at ${String(source)}:${String(line)}:${String(col)}`,
    };
  }

  // Returns log data for browsers that send th e entire error object
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

          const functionName = mapped.name || frame.functionName || 'anonymous';
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
    console.log(`Failed to read sourcemaps from ${config.path}`);
  }
  console.log('********', mappers);
  return mappers;

  function toSourceMapper(maps, fName) {
    const jsName = path.basename(fName, config.ext);
    const fullFname = path.join(config.path, fName);
    const sourceMapConents = fs.readFileSync(fullFname, 'utf8');
    maps[jsName] = new sourcemap.SourceMapConsumer(sourceMapConents);
    return maps;
  }
}
