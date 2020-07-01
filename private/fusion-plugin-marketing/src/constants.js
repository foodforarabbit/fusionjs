// @flow
export const TRACK_URL = '/_track';

export const QUERY_KEYS = [
  'uclick_id',
  'utm_source',
  'utm_term',
  'utm_content',
  'utm_medium',
  'utm_campaign',
  'ad_id',
  'adgroup_id',
  'campaign_id',
  'kw_id',

  'gclid',
  'gclsrc',
  'click_id',
  '_ga',
  'lang',
  'exp_var',
  'exp',
  'lic',
  'invite_code',
  'locality',
  'city_id',
  'ext_id',
  'ran',
  'lint_id',
  'lphy_id',
  'pos',
  'dev',
  'net',
  'match',
  'placement',
  'target',

  // Deprecated
  'ag_kwid',
  'kwid',
  'kw',
  'cid',
  'adg_id',
];

export const TRACK_TOPIC = {
  version: 11,
  topic: 'hp-clay_marketing_tracking-track',
};

export const OPTIMIZELY_COOKIE_KEY = 'optimizely-pid_cid_exp_var';
