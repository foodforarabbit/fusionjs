# @uber/fusion-plugin-web-analytics

A Fusion.js plugin to interface with unified web analytics at Uber. This plugin provides methods to capture events from your Fusion.js app and to redirect those events to various destinations.

---

### Table of contents

* [Installation](#installation)
* [Setup](#setup)
  * [Web analytics Flipr](#web-analytics-and-flipr)
  * [Web analytics Redux enhancer](#web-analytics-redux-enhancer)
  * [Further reading](#further-reading)
* [Usage](#usage)
  * [Redux actions](#redux-actions)
  * [DOM events](#dom-events)
  * [Custom events](#custom-events)
* [API](#api)
  * [`<DOMEventsTracker>`](#dom-events-tracker)
  * [`track()`](#track)

---

### Installation

```sh
yarn add @uber/fusion-plugin-web-analytics
```

---

### Setup

The minimal setup for UWA includes the UWA plugin, Flipr plugin, Flipr configuration and a bootstrap script.

#### Bootstrap script

Add the following script to the `scripts` field of your `package.json`.

```json
{
  "scripts": {
    "update-flipr-uwa-config": "yarn update-flipr-bootstrap uwa-config"
  }
}
```

And run `yarn update-flipr-uwa-config` to bootstrap the initial configuration for web analytics. This pulls down a local copy of the `uwa-config` Flipr namespace for local development.

#### Plugin registration

```js
import FliprPlugin, {FliprConfigToken} from '@uber/fusion-plugin-flipr';
import UberWebAnalytics, {
  UberWebAnalyticsToken,
  UberWebAnalyticsFliprToken,
  UberWebAnalyticsFliprConfigToken,
  UberWebAnalyticsFliprConfig,
} from '@uber/fusion-plugin-web-analytics';

export default (app: FusionApp) => {
  if (__NODE__) {
    // Registers a Flipr plugin, but override the config dependency
    app
      .register(UberWebAnalyticsFliprToken, FliprPlugin)
      .alias(FliprConfigToken, UberWebAnalyticsFliprConfigToken);

    app.register(UberWebAnalyticsFliprConfigToken, UberWebAnalyticsFliprConfig);
  }

  app.register(UberWebAnalyticsToken, UberWebAnalytics);
};
```

This plugin provides the following exports:

* **UberWebAnalytics** - The core plugin
* **UberWebAnalyticsToken** - A unique token that is registered the value of `UberWebAnalytics`
* **UberWebAnalyticsFliprToken** - A unique token that is bound to an instance of Flipr
* **UberWebAnalyticsFliprConfigToken** - A unique token that is bound to Flipr configuration
* **UberWebAnalyticsFliprConfig** - The internal Flipr configuration required for this plugin

Web analytics configuration is stored in Flipr. Since your application may already depend on Flipr, to avoid conflicts, this plugin uses its own Flipr registration.

#### Redux enhancer registration

If you are using Redux, you can configure Redux actions to be emitted to the plugin. In addition to the setup above, you will need to enhance the Redux plugin with the provided enhancer.

```js
import {EnhancerToken} from 'fusion-plugin-react-redux';
import {createWebAnalyticsReduxEnhancer} from '@uber/fusion-plugin-web-analytics';

export default (app: FusionApp) => {
  // IF you have other enhancers
  // e.g. - app.register(EnhancerToken, ActionEmitterEnhancerPlugin);
  app.enhance(EnhancerToken, createWebAnalyticsReduxEnhancer);

  // ELSE you do not have any other enhancers
  // or register web analytics as the first enhancer
  app.register(EnhancerToken, createWebAnalyticsReduxEnhancer());
};
```

#### Service configuration and onboarding

For more information on how to onboard with unified web analytics, visit the Web Platform reference on [Analytics](https://eng.uberinternal.com/docs/web/docs/references/analytics/).

---

### Usage

This plugin captures events from the following sources:

#### Redux actions

If the Redux enhancer was registered, all Redux actions are dispatched as events to the plugin. The behavior of each event is configured within the Flipr configuration.

#### DOM events

The [`<DOMEventsTracker>`](#dom-events-tracker) component captures specified DOM events bubbling-up from the descendants. If your application is tracking mostly common DOM events, you may want to place the component at the root level.

```jsx
// main-page.js
import React from 'react';
import {DOMEventsTracker} from '@uber/fusion-plugin-web-analytics';
import TravelDestinations from './travel-destinations';

export function MainPage(props) {
  return (
    <DOMEventsTracker>
      <div data-tracking-name="main-content">
        <TravelDestinations />
      </div>
    </DOMEventsTracker>
  );
}

// travel-destinations.js
import React from 'react';

export function TravelDestinations(props) {
  return (
    <div>
      <p>Pick your favorite destinations:</p>
      <ul>
        <li><a href="#" data-tracking-name="dest-taipei">Taipei</a></li>
        <li><a href="#" data-tracking-name="dest-mexico-city">Mexico City, Mexico</a></li>
        <li><a href="#" data-tracking-name="dest-london">London, UK</a></li>
      </ul>
    </div>
  );
}
```

For example, the first destination link will emit a `"click.main-content.dest-taipei"` analytical event.

#### Custom events

The following example demonstrates how to emit `terms.show` and `terms.hide` events when a user is toggling the visibility of the terms.

```jsx
// src/components/awesome-offer.js
import React from 'react';
import Button from './button';
import {withServices} from 'fusion-react';

class OfferTerms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
    };
  }

  onClick() {
    this.props.webAnalytics.track(
      `terms.${!this.state.showing ? 'show' : 'hide'}`
    );
    this.setState(state => ({showing: !state.showing}));
  }

  render() {
    return (
      <div>
        <Button onClick={this.onClick.bind(this)}>
          Toggle Terms
        </Button>
        {this.state.showing && "There is no catch."}
      </div>
    );
  }
}
export default withServices({webAnalytics: UberWebAnalyticsToken})(OfferTerms);
```

---

### API

#### `<DOMEventsTracker>`

```js
type props = {
  as?: React.ElementType,
  className?: string,
  config?: {[string]: Array<string>},
  eventPayload?: Object,
  children?: React.Node,
}
```

<DOMEventsTracker> is a React component to capture bubbling-up DOM events from its descendants. When a event is captured, it traverses up to the root and concatenate HTML attribute `data-tracking-name` to generate an unique event name. See the following illustration:

![DOMEventsTracker](https://i.imgur.com/xZ9K1gg.png)

- `props.as` (default: `'div'`)
To capture bubbling-up DOM events, the component places a DOM element. Besides HTML tag types, It's possible to use any React element as long as it's ready to be attached event handlers (e.g. `onClick`).

By default a `<div>` is created, however, sometimes this can cause issues such as styling. This prop is useful to specify alternative capturing elements to avoid such issues.

- `props.config` (default: `{onClick: ['A', 'BUTTON']}`)

Specify DOM events to be captured. The tracker config is presented as `{[EventType]: ['CANONICAL UPPERCASE HTML TAG NAME']}`. For example, if we would like to track `onDragStart` on every `<li>` and `<p>`s, the config should be as the following:
``` js
{
  onDragStart: ['li', 'p']
}
```

- HTML attribute `data-tracking-name`
Name the DOM element with something meaningful the uniquely identify the "scope" and "item".

  - bad example

  ```jsx
  <div data-tracking-name="content">
    <div data-tracking-name="section">
      <button data-tracking-name="button1" />
      <button data-tracking-name="button2" />
    </div>
  </div>
  ```
  The example shown above is bad becuase it generates events names such as `click.content.section.buttion1` which is ambiguous.

  - better example

  ```jsx
  <div data-tracking-name="payment-portal">
    <div data-tracking-name="payment-options">
      <button data-tracking-name="credit-cards" />
      <button data-tracking-name="debit-cards" />
    </div>
  </div>
  ```
  The example shown generates events names such as `click.payment-portal.payment-options.credit-cards`, which is meaningful and unique to the event occurred.

- HTML attribute `data-skip-tracking`
If we wish to prevent some elements covered by `<DOMEventsTracker>` from being tracked, we can simply specify the attribute.

```jsx
  <div data-tracking-name="privacy-center">
    <div data-tracking-name="consent">
      <button data-tracking-name="accept">Yes, I accept</button>
      <button data-skip-tracking>Decline</button>
    </div>
  </div>
```
In the given example, the "Decline" button would never emit analytical events.

- HTML attribute `data-tracking-payload`
If we wish to append local context to the final payload in `<DOMEventsTracker>` you can add an optional payload attribute. Note: Make sure to seralize the payload object using the provided function.
```jsx
  import {serializePayload} from '@uber/fusion-plugin-web-analytics';
  ...
  <div data-tracking-name="products-list" data-tracking-payload={serializePayload({city: 1})}>
      {products.map((product) => (
        <div data-tracking-name="product">
          <div>{product.name}</div>
          <button data-tracking-name="book" data-tracking-payload={serializePayload({productName: product.name})}>Book</button>
        </div>
      ))}

  </div>
```
In the given example, the "Decline" button would never emit analytical events.

- `props.eventPayload`
Optional, the payload to be associated with the analytical events.

#### track()

```js
webAnalytics.track(
  eventKey: string,
  eventPayload?: Object,
  contextOverride?: Object
)
```
`eventKey: string`
An unique key to identify the event. This is NOT related to the final event name in the analytics services.

`eventPayload: Object`
The payload assotiated with the particular event. Typically you would only have to pass on a payload if the analytical data is derived from props, local state...etc. You DO NOT have to pass on a payload if data is from Redux or global/window(including cookies, url...etc).

`contextOverride: Object`
