import {t} from '@uber/isomorphic-i18n';
import React from 'react';

function Test() {
  const nonJSX = t('thing');
  return (
    <div>
      <div>
        <div>{t('key', {a: 'lol'})}</div>
        <div>{t('key', something)}</div>
        <div>Hello {t('lol')}</div>
        <Something a={t('test')} />
        <input placeholder={t('another')} />
      </div>
      <div>
        <div>{t(identifier, {test: 'args'})}</div>
        <div>Hello {t(identifier)}</div>
        <Something a={t(identifier)} />
        <input placeholder={t(identifier)} />
      </div>
    </div>
  );
}
