// @flow
import {snakeCase} from '../src/snakecase';

test('snakecase', () => {
  expect(snakeCase('get.users  .3')).toEqual('get_users_3');
  expect(snakeCase('get-Users')).toEqual('get_users');
  expect(snakeCase('get2019Users')).toEqual('get_2019_users');
  expect(snakeCase('getP2PUsers')).toEqual('get_p2p_users');
});
