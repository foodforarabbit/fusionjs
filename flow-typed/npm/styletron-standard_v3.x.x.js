// @flow

declare module 'styletron-standard' {
  import type {
    StandardProperties,
    VendorProperties,
    ObsoleteProperties,
    SvgProperties,
    AnimationNameProperty as CTAnimationNameProperty,
    FontFamilyProperty as CTFontFamilyProperty,
    FontFace as CTFontFace,
  } from '@rtsao/csstype';

  // src/style-types.js
  declare export type KeyframesObject = {
    from?: Properties,
    to?: Properties,
    [string]: Properties,
  };
  declare type AnimationNameProperty =
    | CTAnimationNameProperty
    | KeyframesObject;
  declare export type FontFaceObject = CTFontFace;
  declare type FontFamilyProperty = CTFontFamilyProperty | FontFaceObject;
  declare type TLength = string | 0;
  declare type Properties = {
    ...StandardProperties<TLength>,
    // $FlowFixMe
    ...VendorProperties<TLength>,
    ...ObsoleteProperties<TLength>,
    ...SvgProperties<TLength>,
    animationName?: AnimationNameProperty,
    fontFamily?: FontFamilyProperty | FontFamilyProperty[],
    MozAnimationName?: AnimationNameProperty,
    WebkitAnimationName?: AnimationNameProperty,
    OAnimationName?: AnimationNameProperty,
  };

  // src/index.js
  declare export type StyleObject = $Shape<{
    ...Properties,
    [string]: StyleObject, // Unrecognized properties are assumed to be media queries or pseudo selectors w/ nested style object. See: https://github.com/styletron/styletron-standard
  }>;
  declare export interface StandardEngine {
    renderStyle(style: StyleObject): string;
    renderKeyframes(keyframes: KeyframesObject): string;
    renderFontFace(fontFace: FontFaceObject): string;
  }
  declare export function driver(
    style: StyleObject,
    styletron: StandardEngine
  ): string;
  declare export function getInitialStyle(): StyleObject;
  declare export function renderDeclarativeRules(
    style: StyleObject,
    styletron: StandardEngine
  ): StyleObject;
}
