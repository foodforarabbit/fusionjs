# @uber/fusion-analyticsjs-utils

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

**DO NOT depend on this package directly.** Miscellaneous utils for Fusion analytics plugins. 

**DO NOT depend on this package directly.** If you are looking to set up analytics for your web applications, please check out https://engdocs.uberinternal.com/web/docs/guides/analytics

---

### Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [Functions](#functions)
    - [`cleanData`](#cleandata)
    - [`compactArray`](#compactarray)
    - [`dataQueue`](#dataqueue)
    - [`isEmpty`](#isempty)
    - [`pageData`](#pagedata)
    - [`stringifyData`](#stringifydata)

---

### Installation

```sh
yarn add @uber/fusion-analyticsjs-utils
```

---

### Usage

```js
import {
  cleanData,
  compactArray,
  dataQueue,
  isEmpty,
  pageData,
  stringifyData,
} from '@uber/fusion-analyticsjs-utils';
```

---

### API

#### Functions

##### `cleanData`
```js
cleanData(data: Object): Object
```
Removes empty strings, null, and undefined values from an object

##### `compactArray`
```js
compactArray(arr: Array<mixed>): Array<mixed>
```

Removes empty items in a given array

##### `dataQueue`
```js
dataQueue(name: string): () => void
```

Creates a global data queue and returns an `queue()` function.

##### `isEmpty`
```js
isEmpty(myVar: Object): boolean
```

Checks if given variable is `undefined` or `null`.

##### `pageData`
```js
pageData(): {
  host: string,
  href: string,
  pathname: string,
  referrer: string,
  title: string,
  url: string,
}
```

Extracts page related data from `window`/`document`

##### `stringifyData`
```js
stringifyData(obj: Object): Object
```

Convert given object to a flat object with just strings and arrays