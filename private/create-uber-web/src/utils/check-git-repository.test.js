/* @flow */

import {checkGitRepository} from './check-git-repository.js';
import {exec} from '@dubstep/core';

jest.mock('@dubstep/core', () => ({
  exec: jest.fn(() => Promise.resolve()),
}));

test('checkGitRepository is successful if all commands return correct values', async () => {
  (exec: any)
    .mockReturnValueOnce(Promise.resolve('true'))
    .mockReturnValueOnce(Promise.resolve('master'))
    .mockReturnValueOnce(Promise.resolve('aaaaa'))
    .mockReturnValueOnce(Promise.resolve(''))
    .mockReturnValueOnce(Promise.resolve('aaaaa'));
  await expect(checkGitRepository()).resolves.toBe(undefined);
});

test('checkGitRepository fails if current repo is not a git repo', async () => {
  (exec: any).mockReturnValueOnce(Promise.resolve('false'));
  await expect(checkGitRepository()).rejects.toMatchInlineSnapshot(
    `[Error: Your current directory is not a git repository. Please cd to your project's repository and try again.]`
  );
});

test('checkGitRepository fails if current branch is not master', async () => {
  (exec: any)
    .mockReturnValueOnce(Promise.resolve('true'))
    .mockReturnValueOnce(Promise.resolve('branch'));
  await expect(checkGitRepository()).rejects.toMatchInlineSnapshot(
    `[Error: You are not currently on the master branch. Please switch branches and try again.]`
  );
});

test('checkGitRepository fails if current branch is not in sync with origin', async () => {
  (exec: any)
    .mockReturnValueOnce(Promise.resolve('true'))
    .mockReturnValueOnce(Promise.resolve('master'))
    .mockReturnValueOnce(Promise.resolve('aaaaa'))
    .mockReturnValueOnce(Promise.resolve(''))
    .mockReturnValueOnce(Promise.resolve('bbbbb'));
  await expect(checkGitRepository()).rejects.toMatchInlineSnapshot(
    `[Error: Your current directory is not in sync with the remote branch. Please pull or push and try again.]`
  );
});

test('checkGitRepository fails if local has changes', async () => {
  (exec: any)
    // $FlowFixMe
    .mockReturnValueOnce(Promise.resolve('true'))
    .mockReturnValueOnce(Promise.resolve('master'))
    .mockReturnValueOnce(Promise.resolve('aaaaa'))
    .mockReturnValueOnce(Promise.resolve('M package.json'))
    .mockReturnValueOnce(Promise.resolve('bbbbb'));
  await expect(checkGitRepository()).rejects.toMatchInlineSnapshot(
    `[Error: You have uncommited changes in this repository. Please commit or reset them and try again.]`
  );
});
