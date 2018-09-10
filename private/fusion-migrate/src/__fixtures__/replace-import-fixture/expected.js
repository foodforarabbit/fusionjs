module.exports = {
  defaultSpecifierSameFonts1: `
    import c from 'c';
    import b from 'b';`,
  defaultSpecifierSameFonts2: `
    import {c} from 'c';
    import b from 'b';`,
  namedSpecifierSwitchTypes1: `
    import c from 'c';
    import b from 'b';`,
  namedSpecifierSwitchTypes2: `
    import {c} from 'c';
    import b from 'b';`,
  noDuplicates: `
    import c from 'c';`,
  nonMatchingSource: `
    import b from 'b';`,
  nonMatchingDefaultSpecifier: `
    import c from 'c';`,
  nonMatchingNamedSpecifier: `
    import {b} from 'a';`,
  replacesUsage: `
    import c from 'c';
    import b from 'b';
    c(23);
    f(true);
    c('hello');`,
  doesNotReplacesUsage: `
    import b from 'b';
    a(23);
    f(true);
    a('hello');`,
  replacesUsageNoShadow: `
    import c from 'c';
    import b from 'b';
    c(23);
    f(true);
    function fn() {
      c('hello');
    }`,
  doesNotReplaceUsageShadow: `
    import c from 'c';
    import b from 'b';
    c(23);
    f(true);
    function fn(a) {
      a('hello');
    }`,
}
