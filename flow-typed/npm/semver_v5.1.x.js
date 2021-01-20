// flow-typed signature: dc381ee55406f66b7272c6343db0834b
// flow-typed version: da30fe6876/semver_v5.1.x/flow_>=v0.25.x

declare module "semver" {
  declare export type Release =
    | "major"
    | "premajor"
    | "minor"
    | "preminor"
    | "patch"
    | "prepatch"
    | "prerelease";

  // The supported comparators are taken from the source here:
  // https://github.com/npm/node-semver/blob/8bd070b550db2646362c9883c8d008d32f66a234/semver.js#L623
  declare export type Operator =
    | "==="
    | "!=="
    | "=="
    | "="
    | "" // Not sure why you would want this, but whatever.
    | "!="
    | ">"
    | ">="
    | "<"
    | "<=";

  declare class SemVer {
    build: Array<string>;
    loose: ?boolean;
    major: number;
    minor: number;
    patch: number;
    prerelease: Array<string | number>;
    raw: string;
    version: string;

    constructor(version: string | SemVer, loose?: boolean): SemVer;
    compare(other: string | SemVer): -1 | 0 | 1;
    compareMain(other: string | SemVer): -1 | 0 | 1;
    comparePre(other: string | SemVer): -1 | 0 | 1;
    format(): string;
    inc(release: Release, identifier: string): this;
  }

  declare class Comparator {
    loose?: boolean;
    operator: Operator;
    semver: SemVer;
    value: string;

    constructor(comp: string | Comparator, loose?: boolean): Comparator;
    parse(comp: string): void;
    test(version: string): boolean;
  }

  declare class Range {
    loose: ?boolean;
    raw: string;
    set: Array<Array<Comparator>>;

    constructor(range: string | Range, loose?: boolean): Range;
    format(): string;
    parseRange(range: string): Array<Comparator>;
    test(version: string): boolean;
    toString(): string;
  }

  declare module.exports: ((version: string) => SemVer) & {
    toComparators: (range: string | Range, loose?: boolean) => Array<Array<string>>,
    parse: (version: string, loose?: boolean) => ?SemVer,
    SEMVER_SPEC_VERSION: string,
    re: Array<RegExp>,
    src: Array<string>,
    // Functions
    valid: (v: string | SemVer, loose?: boolean) => string | null,
    clean: (v: string | SemVer, loose?: boolean) => string | null,
    inc: (
      v: string | SemVer,
      release: Release,
      loose?: boolean,
      identifier?: string
    ) => string | null,
    inc: (
      v: string | SemVer,
      release: Release,
      identifier: string
    ) => string | null,
    major: (v: string | SemVer, loose?: boolean) => number,
    minor: (v: string | SemVer, loose?: boolean) => number,
    patch: (v: string | SemVer, loose?: boolean) => number,

    // Comparison
    gt: (
      v1: string | SemVer,
      v2: string | SemVer,
      loose?: boolean
    ) => boolean,
    gte: (
      v1: string | SemVer,
      v2: string | SemVer,
      loose?: boolean
    ) => boolean,
    lt: (
      v1: string | SemVer,
      v2: string | SemVer,
      loose?: boolean
    ) => boolean,
    lte: (
      v1: string | SemVer,
      v2: string | SemVer,
      loose?: boolean
    ) => boolean,
    eq: (
      v1: string | SemVer,
      v2: string | SemVer,
      loose?: boolean
    ) => boolean,
    neq: (
      v1: string | SemVer,
      v2: string | SemVer,
      loose?: boolean
    ) => boolean,
    cmp: (
      v1: string | SemVer,
      comparator: Operator,
      v2: string | SemVer,
      loose?: boolean
    ) => boolean,
    compare: (
      v1: string | SemVer,
      v2: string | SemVer,
      loose?: boolean
    ) => -1 | 0 | 1,
    rcompare: (
      v1: string | SemVer,
      v2: string | SemVer,
      loose?: boolean
    ) => -1 | 0 | 1,
    compareLoose: (
      v1: string | SemVer,
      v2: string | SemVer
    ) => -1 | 0 | 1,
    diff: (v1: string | SemVer, v2: string | SemVer) => ?Release,
    sort: (
      list: Array<string | SemVer>,
      loose?: boolean
    ) => Array<string | SemVer>,
    rsort: (
      list: Array<string | SemVer>,
      loose?: boolean
    ) => Array<string | SemVer>,
    compareIdentifiers: (
      v1: string | SemVer,
      v2: string | SemVer
    ) => -1 | 0 | 1,
    rcompareIdentifiers: (
      v1: string | SemVer,
      v2: string | SemVer
    ) => -1 | 0 | 1,

    // Ranges
    validRange: (
      range: string | Range,
      loose?: boolean
    ) => string | null,
    satisfies: (
      version: string | SemVer,
      range: string | Range,
      loose?: boolean
    ) => boolean,
    maxSatisfying: (
      versions: Array<string | SemVer>,
      range: string | Range,
      loose?: boolean
    ) => string | SemVer | null,
    gtr: (
      version: string | SemVer,
      range: string | Range,
      loose?: boolean
    ) => boolean,
    ltr: (
      version: string | SemVer,
      range: string | Range,
      loose?: boolean
    ) => boolean,
    outside: (
      version: string | SemVer,
      range: string | Range,
      hilo: ">" | "<",
      loose?: boolean
    ) => boolean
  };
}
