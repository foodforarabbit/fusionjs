const {withTextFile, findFiles, step} = require('@dubstep/core');

module.exports = step('replace-export-default-template-string', async () => {
  const files = await findFiles('src/**/*.js');
  for (const file of files) {
    await withTextFile(file, content => {
      return content.replace(
        'export default `',
        'export const __TEMPLATE__TODO__ = `'
      );
    });
  }
});
