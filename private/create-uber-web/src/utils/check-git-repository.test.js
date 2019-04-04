/* @flow */

import {checkGitRepository} from './check-git-repository.js';
import {exec} from '@dubstep/core';

jest.mock('@dubstep/core', () => ({
  exec: jest.fn(),
}));

test('checkGitRepository is successful if all commands return correct values', async () => {
  exec
    // $FlowFixMe
    .mockReturnValueOnce(Promise.resolve('true'))
    .mockReturnValueOnce(Promise.resolve('master'))
    .mockReturnValueOnce(Promise.resolve('aaaaa'))
    .mockReturnValueOnce(Promise.resolve(''))
    .mockReturnValueOnce(Promise.resolve('aaaaa'));
  await expect(checkGitRepository()).resolves.toBe(undefined);
});

test('checkGitRepository fails if current repo is not a git repo', async () => {
  // $FlowFixMe
  exec.mockReturnValueOnce(Promise.resolve('false'));
  await expect(checkGitRepository()).rejects;
});

test('checkGitRepository fails if current branch is not master', async () => {
  exec
    // $FlowFixMe
    .mockReturnValueOnce(Promise.resolve('true'))
    .mockReturnValueOnce(Promise.resolve('branch'));
  await expect(checkGitRepository()).rejects;
});

test('checkGitRepository fails if current branch is not in sync with origin', async () => {
  exec
    // $FlowFixMe
    .mockReturnValueOnce(Promise.resolve('true'))
    .mockReturnValueOnce(Promise.resolve('master'))
    .mockReturnValueOnce(Promise.resolve('aaaaa'))
    .mockReturnValueOnce(Promise.resolve(''))
    .mockReturnValueOnce(Promise.resolve('bbbbb'));
  await expect(checkGitRepository()).rejects;
});

test('checkGitRepository fails if local has changes', async () => {
  exec
    // $FlowFixMe
    .mockReturnValueOnce(Promise.resolve('true'))
    .mockReturnValueOnce(Promise.resolve('master'))
    .mockReturnValueOnce(Promise.resolve('aaaaa'))
    .mockReturnValueOnce(Promise.resolve('M package.json'))
    .mockReturnValueOnce(Promise.resolve('bbbbb'));
  await expect(checkGitRepository()).rejects;
});
