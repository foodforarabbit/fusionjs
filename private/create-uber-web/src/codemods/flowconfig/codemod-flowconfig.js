// @flow

import semver from 'semver';
import {withTextFile} from '@dubstep/core';

export async function removeFlowConfigLines({
  dir,
  section,
  pattern,
}: {
  dir: string,
  section: string,
  pattern: RegExp,
}) {
  await withFlowConfig(dir, config => {
    if (config[section]) {
      config[section] = config[section].filter(line => {
        // ignore comments, remove matching lines
        return line.comment || !pattern.test(line.trimmed);
      });
    }
    return config;
  });
}

export async function ensureFlowConfigLine({
  dir,
  section,
  line,
}: {
  dir: string,
  section: string,
  line: string,
}) {
  await withFlowConfig(dir, config => {
    config[section] = config[section] || [
      {
        comment: false,
        trimmed: '',
        raw: '',
      },
    ];
    const included = config[section].some(
      configLine => configLine.trimmed === line
    );
    if (!included) {
      config[section].unshift({
        comment: isComment(line),
        trimmed: line.trim(),
        raw: line,
      });
    }
    return config;
  });
}

export async function ensureMinimalFlowConfigVersion({
  dir,
  version,
}: {
  dir: string,
  version: string,
}) {
  await withFlowConfig(dir, config => {
    if (!config.version) {
      config.version = [
        {
          comment: false,
          trimmed: version,
          raw: version,
        },
        {
          comment: false,
          trimmed: '',
          raw: '',
        },
      ];
    } else {
      const versionLine = config.version.find(
        line => !line.comment && line.trimmed !== ''
      );
      if (versionLine) {
        const currentVersion = versionLine.trimmed;
        if (
          !semver.valid(currentVersion) ||
          semver.gt(version, currentVersion)
        ) {
          versionLine.trimmed = version;
          versionLine.raw = version;
        }
      } else {
        config.version.unshift({
          comment: false,
          trimmed: version,
          raw: version,
        });
      }
    }
    return config;
  });
}

async function withFlowConfig(dir, mutation) {
  await withTextFile(`${dir}/.flowconfig`, async flowConfig => {
    const UNGROUPED = '__UNGROUPED__';
    let parsedConfig = {};
    let current: ?Array<{}> = null;
    flowConfig.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      const matchParts = trimmedLine.replace(/\s/g, '').match(/\[(.*)\]/);
      const match = matchParts && matchParts[1];
      if (!match && !current) {
        if (trimmedLine !== '') {
          parsedConfig[UNGROUPED] = parsedConfig[UNGROUPED] || [];
          parsedConfig[UNGROUPED].push({
            comment: true, // prevent from editing
            trimmed: trimmedLine,
            raw: line,
          });
        }
        return;
      }
      if (match) {
        parsedConfig[match] = parsedConfig[match] || [];
        current = parsedConfig[match];
      } else {
        if (current) {
          current.push({
            comment: isComment(trimmedLine),
            trimmed: trimmedLine,
            raw: line,
          });
        }
      }
    });

    // apply mutation
    parsedConfig = mutation(parsedConfig);

    const output = Object.keys(parsedConfig).map(section => {
      let res = section === UNGROUPED ? '' : `[${section}]\n`;
      res += parsedConfig[section].map(line => line.raw).join('\n');
      return res;
    });
    return output.join('\n');
  });
}

function isComment(line) {
  return /^[#;💩]/u.test(line.trim());
}
