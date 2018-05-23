const supportedMethods = ['go', 'goBack', 'goForward', 'push', 'replace'];

export class BrowserHistoryCompat {
  constructor() {
    this._listeners = [];
    supportedMethods.forEach(methodName => {
      this[methodName] = () => {
        throw Error(
          `
          [BrowserHistoryCompat]
          Attempt to invoke browserHistoryCompat.${methodName}() but history is not already set.
          BrowserHistoryCompat methods are only available in descendant components of <Router4Compat>.
          `
        );
      };
    });
    this.listen = listener => {
      this._listeners.push(listener);
      return () => {
        throw Error('[BrowserHistoryCompat] unlisten() is unsupported.');
      };
    };
  }
  setHistory(history) {
    if (history) {
      this._listeners.forEach(listener => history.listen(listener));

      supportedMethods.push('listen');
      supportedMethods.forEach(
        methodName =>
          history[methodName] &&
          (this[methodName] = history[methodName].bind(history))
      );
    }
  }
}
