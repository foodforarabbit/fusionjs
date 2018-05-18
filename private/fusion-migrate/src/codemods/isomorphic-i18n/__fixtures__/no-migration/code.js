import i18n from '@uber/bedrock/isomorphic-i18n';
import React from 'react';

function Test() {
  const nonJSX = i18n.t(identifier);
  i18n.addLanguage('test');
  return (
    <div>
      <div>
        <div>{i18n.t(identifier, {test: 'args'})}</div>
        <div>Hello {i18n.t(identifier)}</div>
        <Something a={i18n.t(identifier)} />
        <input placeholder={i18n.t(identifier)} />
      </div>
    </div>
  );
}
