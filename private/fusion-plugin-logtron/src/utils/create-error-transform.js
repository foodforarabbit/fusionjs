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
    // TODO: message should just be string but Flow...  ¯\_(ツ)_/¯
    let parsedError: ?{
      message?: string,
      error?: Error,
      source?: string,
      stack?: string,
      line?: number,
    };

    if (data.error) {
      parsedError = await handleErrorObject(data.error);
    } else {
      // can't transform
      return data;
    }

    if (parsedError.stack) {
      parsedError.stack = parsedError.stack.trim();
    }

    return parsedError;
  };

  // Returns log data for browsers that send the real error object or an error-like object
  async function handleErrorObject(error) {
    let stack = '';
    if (error.stack) {
      stack = await getMappedStackFromErrorStack(error);
    } else if (error.source && error.line) {
      stack = await getMappedStackFromErrorSourceAndLine(error);
    }
    const message = error.message;

    // create real Error if error-like object, clone if already real Error, because:
    // 1) healthline requires real Error with stack
    // 2) sentry logger potentially updates message
    error = new Error(message);
    error.stack = stack;

    const logMeta = {
      message,
      error,
      stack,
    };
    return logMeta;
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
    return mappers;

    function toSourceMapper(maps, fName) {
      const jsName = path.basename(fName, config.ext);
      const fullFname = path.join(config.path, fName);
      const sourceMapConents = fs.readFileSync(fullFname, 'utf8');
      maps[jsName] = new sourcemap.SourceMapConsumer(sourceMapConents);
      return maps;
    }
  }

  async function applySourceMap(fileName, line, column) {
    // '-with-map.js' uses same map as non-suffixed file
    const baseFileName = path
      .basename(String(fileName))
      // replace last occurence
      .replace(/-with-map(?!.*-with-map.*)/, '');
    const map = mappers ? await mappers[baseFileName] : null;
    return map ? map.originalPositionFor({line, column}) : null;
  }

  async function getMappedStackFromErrorStack(error) {
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
    return `\n${frames.join('\n    ')}`
      .replace(/(js)(\?.+)$/gm, '$1')
      .replace(/webpack:\/\/\//g, './')
      .replace(/~\//g, 'node_modules/');
  }

  async function getMappedStackFromErrorSourceAndLine(error) {
    // $FlowFixMe - legacy Error properties
    let {source, line, col} = error;
    const mapped = await applySourceMap(source, line, col);

    const name = mapped && mapped.name ? mapped.name : 'unknown function name';
    source = mapped ? mapped.source : source;
    line = mapped ? mapped.line : line;
    col = (mapped ? mapped.column : col) || '';

    return `${name} at ${String(source)}:${String(line)}:${String(col)}`;
  }
}
