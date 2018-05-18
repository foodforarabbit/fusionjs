import i18n from '@uber/bedrock/isomorphic-i18n';
import React from 'react';

function Test() {
  const nonJSX = i18n.t('thing');
  i18n.addLanguage('test');
  return (
    <div>
      <div>
        <div>{i18n.t('key', {a: 'lol'})}</div>
        <div>{i18n.t('key', something)}</div>
        <div>Hello {i18n.t('lol')}</div>
        <Something a={i18n.t('test')} />
        <input placeholder={i18n.t('another')} />
      </div>
      <div>
        <div>{i18n.t(identifier, {test: 'args'})}</div>
        <div>Hello {i18n.t(identifier)}</div>
        <Something a={i18n.t(identifier)} />
        <input placeholder={i18n.t(identifier)} />
      </div>
    </div>
  );
}
