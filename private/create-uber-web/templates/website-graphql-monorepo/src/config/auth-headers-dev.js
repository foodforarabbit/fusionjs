/*
 * @flow
 *
 * WARNING
 *
 * Changes to this file that include sensitive materials should not be committed
 * to the repository.  If you decide to make changes, consider using the 'skip-worktree'
 * flag in git:
 *
 * e.g. 'git update-index --skip-worktree src/config/auth-headers.js'
 *
 * More details: https://git-scm.com/docs/git-update-index#git-update-index---no-skip-worktree
 */

// Configuration for auth headers to be used as development overrides
export default {
  uuid: __NODE__
    ? process.env.UBER_OWNER_UUID || 'ca74fe77-e86a-4884-af42-daa3923f898f'
    : undefined,
  groups: undefined,
  roles: undefined,
  token: undefined,
  email: undefined,
};
