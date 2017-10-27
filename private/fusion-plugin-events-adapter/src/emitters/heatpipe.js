export const webTopicInfo = {
  topic: 'hp-event-web',
  version: 8,
};

export default function({events, Session, Geolocation, I18n, appName}) {
  const Heatpipe = {
    publish: ({topicInfo, message}) => {
      events.emit('heatpipe:publish', {topicInfo, message});
    },
    publishWebEvents: ({message, ctx, webEventsMeta}) => {
      Heatpipe.publish({
        topicInfo: webTopicInfo,
        message: {
          ...message,
          ...getWebEventsMetaFields(webEventsMeta),
          ...getContextFields(ctx),
        },
      });
    },
  };

  function getWebEventsMetaFields(webEventsMeta) {
    if (webEventsMeta) {
      return {
        page: webEventsMeta.page,
        dimensions: webEventsMeta.dimensions,
      };
    }
    return {};
  }

  function getContextFields(ctx) {
    if (ctx) {
      // TODO: Should we do more validation here? heatpipe will do validation
      // against the schema, but it can be difficult to surface that to the user
      const userAgent = ctx.useragent || {};
      // TODO: Should we add more information here about the device/cpu archictecture?
      const uaInfo =
        (userAgent && {
          name: userAgent.browser.name,
          version: userAgent.browser.version,
          engine: userAgent.engine.name,
          os: userAgent.os.name,
          os_version: userAgent.os.version,
          user_agent: userAgent.ua,
        }) ||
        {};
      const analyticsSession =
        (Session && Session.of(ctx).get('analytics')) || {};
      const geolocation = (Geolocation && Geolocation.of(ctx).lookup()) || {};

      return {
        browser: {
          ...uaInfo,
          locale: (I18n && I18n.of(ctx).locale.toString()) || '',
        },
        app_name: appName,
        user_id: ctx.headers['x-auth-params-user-uuid'] || 'unknown',
        session_id: analyticsSession.id,
        session_time_ms: analyticsSession.time,
        time_ms: Date.now(),
        ...geolocation,
      };
    }
    return {};
  }

  return Heatpipe;
}
