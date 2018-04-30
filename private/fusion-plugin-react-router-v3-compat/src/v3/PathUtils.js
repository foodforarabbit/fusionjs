// Unchanged: https://github.com/ReactTraining/history/blob/v3/modules/PathUtils.js
const extractPath = string => {
  /* eslint-disable-next-line no-useless-escape */
  const match = string.match(/^(https?:)?\/\/[^\/]*/);
  return match == null ? string : string.substring(match[0].length);
};

export const parsePath = path => {
  let pathname = extractPath(path);
  let search = '';
  let hash = '';

  const hashIndex = pathname.indexOf('#');
  if (hashIndex !== -1) {
    hash = pathname.substring(hashIndex);
    pathname = pathname.substring(0, hashIndex);
  }

  const searchIndex = pathname.indexOf('?');
  if (searchIndex !== -1) {
    search = pathname.substring(searchIndex);
    pathname = pathname.substring(0, searchIndex);
  }

  if (pathname === '') pathname = '/';

  return {
    pathname,
    search,
    hash,
  };
};
