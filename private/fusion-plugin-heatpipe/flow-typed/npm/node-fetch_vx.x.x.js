// @flow
declare module 'node-fetch' {
  declare type FetchOptions = {
    method: string,
    body: string,
    headers: {[string]: string},
  };

  declare type FetchResponse = {
    json(): Promise<{[string]: any}>,
    text(): Promise<string>,
  };

  declare module.exports: (
    url: string,
    options: FetchOptions
  ) => Promise<FetchResponse>;
}
