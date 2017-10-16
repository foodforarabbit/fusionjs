/* eslint-env browser */
import server from './server';
import client from './client';

export default (__NODE__ ? server : client);
