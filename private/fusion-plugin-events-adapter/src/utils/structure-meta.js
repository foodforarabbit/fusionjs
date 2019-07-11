// @noflow
/**
 * Structures meta information attached to a Redux action to a mapped object to according fields of the `hp-event-web` Heatpipe topic
 * @param {Object.<string, string|boolean|number>} trackingMeta - a flatten object with custom fields to be published to the `hp-event-web` Heatpipe topic
 * @returns {Object} New object with properties sorted by types and mapped to according fields of the `hp-event-web` Heatpipe topic
 */

function structureMeta(trackingMeta) {
  // Partially referenced: https://code.uberinternal.com/diffusion/UMETAHU/browse/master/src/util/structureMeta.js
  if (!trackingMeta) {
    return {};
  }

  if (typeof trackingMeta !== 'object' || Array.isArray(trackingMeta)) {
    throw new Error('_trackingMeta: Only object(and not array) can be parsed.');
  }

  // See Heatpipe topic `hp-event-web`: https://watchtower.uberinternal.com/watchtower/#topic=hp-event-web
  const metaObj = Object.assign({}, trackingMeta);
  const meta = {};
  const meta_bool = {};
  const meta_long = {};

  // Iterate over metaObj keys/values to determine where/how to store each value
  for (const key in metaObj) {
    if (Object.prototype.hasOwnProperty.call(metaObj, key)) {
      if (key === '') {
        throw new Error('_trackingMeta: Empty string keys are not allowed');
      }
      const value = metaObj[key];
      switch (typeof value) {
        case 'string':
          meta[key] = value;
          break;
        case 'boolean':
          meta_bool[key] = value;
          break;
        case 'number':
          // only integers
          if (value % 1 === 0) {
            meta_long[key] = value;
          } else {
            throw new TrackingMetaInvalidTypeError(key, value);
          }
          break;
        default:
          if (typeof value === 'object' || Array.isArray(value)) {
            throw new Error(
              '_trackingMeta: Nested objects or arrays are disallowed.'
            );
          }
          throw new TrackingMetaInvalidTypeError(key, value);
      }
    }
  }

  return {
    meta,
    meta_bool,
    meta_long,
  };
}

class TrackingMetaInvalidTypeError extends Error {
  constructor(key, value, ...args) {
    super(...args);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TrackingMetaInvalidTypeError);
    }

    this.message = `_trackingMeta: Key '${key}' contains value of type '${typeof value}'. Only values of the following types are allowed:
  - 'string',
  - 'number' (integers),
  - 'boolean'`;
  }
}

export default structureMeta;
