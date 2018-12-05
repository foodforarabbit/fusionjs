// @flow
import chalk from 'chalk';
/* eslint-disable no-console */

const logger = (msg: any, meta: any) => console.log(msg, meta);

logger.title = (msg: string) => console.log(chalk.underline(chalk.green(msg)));

export default logger;
