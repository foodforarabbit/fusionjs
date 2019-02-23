/* @flow */

import {exec} from '@dubstep/core';

export const checkGitRepository = async () => {
  await Promise.all([
    checkCWD(),
    checkCurrentBranch(),
    checkBranchInSync(),
    checkLocalStatus(),
  ]);
};

const checkCWD = async () => {
  const insideWorkTree = await exec(
    'git rev-parse --is-inside-work-tree'
  ).catch(() => 'false');

  if (insideWorkTree !== 'true') {
    throw new Error(
      "Your current directory is not a git repository. Please cd to your project's repository and try again."
    );
  }
};

const checkCurrentBranch = async () => {
  const currentBranchName = await exec('git rev-parse --abbrev-ref HEAD').catch(
    () => 'false'
  );

  if (currentBranchName !== 'master') {
    throw new Error(
      'You are not currently on the master branch. Please switch branches and try again.'
    );
  }
};

const checkBranchInSync = async () => {
  const localSha = await exec('git rev-parse master').catch(() => 'localSha');
  const originSha = await exec('git rev-parse origin/master').catch(
    () => 'originSha'
  );

  if (localSha !== originSha) {
    throw new Error(
      'Your current directory is not in sync with the remote branch. Please pull or push and try again.'
    );
  }
};

const checkLocalStatus = async () => {
  const localStatus = await exec('git status -s').catch(() => 'localStatus');

  if (localStatus !== '') {
    throw new Error(
      'You have uncommited changes in this repository. Please commit or reset them and try again.'
    );
  }
};
