import React from 'react';
import {Router} from 'react-router';
import assetUrl from 'fusion-core';
import routes from '../components/routes';
import {Provider} from 'react-redux';
import {browserHistory} from 'react-router';
import isBrowser from 'is-browser';
import {Component as Head} from '@uber/react-head';

const Root = ({store}) => {
  const title = 'Trips Viewer';
  return (
    <div className={styles.container}>
      <Head
        title="Trips Viewer"
        htmlAttributes={{lang: locale, amp: true}}
        script={[{src: assetUrl('/javascripts/main.js'), nonBlocking: true}]}
        link={[
          {
            rel: 'stylesheet',
            href:
              'https://d1a3f4spazzrp4.cloudfront.net/superfine/6.2.2/superfine.css',
          },
          {
            rel: 'stylesheet',
            href:
              'https://d1a3f4spazzrp4.cloudfront.net/uber-fonts/4.0.0/superfine.css',
          },
          {
            rel: 'icon',
            type: 'image/x-icon',
            href: assetUrl('../../client/static/favicon.ico'),
          },
        ]}
        meta={[
          {name: 'apple-mobile-web-app-capable', content: 'yes'},
          {name: 'apple-mobile-web-app-status-bar-style', content: 'default'},
          {name: 'viewport', content: 'initial-scale=1.0, user-scalable=no'},
        ]}
      />
      <Head
        title={title}
        script={[{src: assetUrl('/javascripts/main.js'), nonBlocking: true}]}
        link={[
          {
            rel: 'stylesheet',
            href:
              'https://d1a3f4spazzrp4.cloudfront.net/superfine/6.2.2/superfine.css',
          },
          {
            rel: 'stylesheet',
            href:
              'https://d1a3f4spazzrp4.cloudfront.net/uber-fonts/4.0.0/superfine.css',
          },
          {
            rel: 'icon',
            type: 'image/x-icon',
            href: assetUrl('../../client/static/favicon.ico'),
          },
        ]}
      />
      <Provider store={store}>{children}</Provider>
    </div>
  );
};

export default Root;
