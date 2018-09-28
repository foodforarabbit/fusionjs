import i18n from '@uber/bedrock/isomorphic-i18n';

function Test() {
  const nonJSX = i18n.t('thing');
  i18n.addLanguage('test');
  return (
    <div>
      <div>
        <div>{i18n.t('key', {a: 'lol'})}</div>
        <div>Hello {i18n.t('lol')}</div>
        <Something a={i18n.t('test')} />
      </div>
    </div>
  );
}
