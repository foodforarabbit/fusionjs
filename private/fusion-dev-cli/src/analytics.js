// @flow

/*::
import type {Arguments} from './parse-args.js';
*/

const fs = require('fs');
const {request} = require('https');
const querystring = require('querystring');

module.exports.Tracker = class {
  async track({command, args} /*: Arguments */) {
    const service = JSON.parse(
      fs.readFileSync(`${process.cwd()}/package.json`, 'utf8')
    ).name;

    return new Promise((resolve, reject) => {
      const req = request(
        {
          host: 'web-telemetry.uberinternal.com',
          path:
            '/api/analytics?' +
            querystring.stringify({
              email: process.env.UBER_OWNER,
              service,
              command,
              args,
            }),
        },
        res => {
          res.on('end', resolve);
        }
      );
      req.on('error', reject);
      req.end();
    });
  }
};
