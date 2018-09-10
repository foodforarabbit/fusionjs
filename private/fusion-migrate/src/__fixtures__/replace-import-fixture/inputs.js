module.exports = {
  defaultSpecifierSameFonts1: `
    import a from 'a';
    import b from 'b';`,
  defaultSpecifierSameFonts2: `
    import {a} from 'a';
    import b from 'b';`,
  namedSpecifierSwitchTypes1: `
    import {a} from 'a';
    import b from 'b';`,
  namedSpecifierSwitchTypes2: `
    import a from 'a';
    import b from 'b';`,
  noDuplicates: `
    import a from 'a';
    import c from 'c';`,
  nonMatchingSource: `
    import b from 'b';`,
  nonMatchingDefaultSpecifier: `
    import b from 'a';`,
  nonMatchingNamedSpecifier: `
    import {b} from 'a';`,
  replacesUsage: `
    import a from 'a';
    import b from 'b';
    a(23);
    f(true);
    a('hello');`,
  doesNotReplacesUsage: `
    import b from 'b';
    a(23);
    f(true);
    a('hello');`,
  replacesUsageNoShadow: `
    import a from 'a';
    import b from 'b';
    a(23);
    f(true);
    function fn() {
      a('hello');
    }`,
    doesNotReplaceUsageShadow: `
    import a from 'a';
    import b from 'b';
    a(23);
    f(true);
    function fn(a) {
      a('hello');
    }`,
}