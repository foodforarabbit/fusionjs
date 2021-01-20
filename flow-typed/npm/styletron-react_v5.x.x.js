// @flow

import { driver } from 'styletron-standard';

declare module 'styletron-react' {
  import type { StandardEngine, StyleObject as StyleObjectImport } from 'styletron-standard';
  import type {
    ElementConfig,
    ComponentType,
    StatelessFunctionalComponent,
    Context,
    Node,
    Component,
  } from 'react';

  // src/types.js
  declare type AssignmentCommutativeReducerContainer = {
    assignmentCommutative: true,
    reducer: StyleObject => StyleObject,
    style: StyleObject,
    factory: StyleObject => AssignmentCommutativeReducerContainer,
  };
  declare type NonAssignmentCommutativeReducerContainer = {
    assignmentCommutative: false,
    reducer: (StyleObject, Object) => StyleObject,
  };
  declare type ReducerContainer =
    | AssignmentCommutativeReducerContainer
    | NonAssignmentCommutativeReducerContainer;
  declare type Styletron = {
    reducers: Array<ReducerContainer>,
    base: any,
    driver: any,
    name?: string,
    wrapper: any,
    getInitialStyle: any,
    ext?: {
      name?: string,
      base: any,
      getInitialStyle: any,
      with: any,
    },
    debug?: {
      stackIndex: number,
      stackInfo: {stack: any, stacktrace: any, message: any},
    },
  };
  declare type ExtractPropTypes = <T>(StyletronComponent<T>) => T;
  declare type StyletronComponent<
    Props
  > = StatelessFunctionalComponent<Props> & {
    __STYLETRON__: any,
  };
  declare type StyledFn = {
    (string, StyleObject): StyletronComponent<{}>,
    <Props>(string, (Props) => StyleObject): StyletronComponent<Props>,
    <Base: ComponentType<any>>(
      Base,
      StyleObject
    ): StyletronComponent<$Diff<ElementConfig<Base>, {className: any}>>,
    <Base: ComponentType<any>, Props>(
      Base,
      (Props) => StyleObject
    ): StyletronComponent<
      $Diff<ElementConfig<Base>, {className: any}> & Props
    >,
  };
  declare type WithStyleFn = {
    <Base: StyletronComponent<any>, Props>(
      Base,
      (Props) => StyleObject
    ): StyletronComponent<$Call<ExtractPropTypes, Base> & Props>,
    <Base: StyletronComponent<any>>(
      Base,
      StyleObject
    ): StyletronComponent<$Call<ExtractPropTypes, Base>>,
  };
  declare type WithTransformFn = <Base: StyletronComponent<any>, Props>(
    Base,
    (StyleObject, Props) => StyleObject
  ) => StyletronComponent<$Call<ExtractPropTypes, Base> & Props>;
  declare type WithWrapperFn = <Base: StyletronComponent<any>, Props>(
    Base,
    (Base) => ComponentType<Props>
  ) => StyletronComponent<$Call<ExtractPropTypes, Base> & Props>;

  // src/dev-tools.js
  declare function addDebugMetadata(instance, stackIndex): void;
  declare type StyletronStyles = {
    classes?: any,
    styles?: any,
    extends?: any,
  };
  declare function setupDevtoolsExtension(): void;
  declare class BrowserDebugEngine {
    constructor(worker: any): void;
    debug({stackIndex: any, stackInfo: any}): string;
  }
  declare class NoopDebugEngine {
    constructor(worker: any): void;
    debug(): void;
  }
  declare export var DebugEngine: typeof BrowserDebugEngine | typeof NoopDebugEngine;

  // src/index.js
  declare export type StyleObject = StyleObjectImport;
  declare var StyletronContext: Context<StandardEngine>;
  declare var HydrationContext: Context<boolean>;
  declare var DebugEngineContext: Context<typeof DebugEngine>;
  declare var ThemeContext: Context<any>;
  declare type DevProviderProps = {
    children: Node,
    value: StandardEngine,
    debugAfterHydration?: boolean,
    debug?: any,
  };
  declare var DevProvider: Component<
    DevProviderProps,
    {hydrating: boolean}
  >;
  declare export var Provider: DevProvider | StyletronContext.Provider;
  declare export function DevConsumer(props: {
    children: (any, any, any) => Node,
  }): Component<any>;
  declare var Consumer: typeof DevConsumer | StyletronContext.Consumer;
  declare type createStyledOpts = {
    getInitialStyle: () => StyleObject,
    driver: typeof driver,
    wrapper: (
      StatelessFunctionalComponent<any>
    ) => ComponentType<any>,
  };
  declare function css(style: StyleObject): string;
  declare var hookReturnValue: [typeof css];
  declare export function useStyletron(): typeof hookReturnValue;
  declare export function createStyled(createStyledOpts): StyledFn;
  declare export var styled: StyledFn;
  declare export var withTransform: WithTransformFn;
  declare export var withStyle: WithStyleFn;
  declare export var withStyleDeep: WithStyleFn;
  declare export var withWrapper: WithWrapperFn;
  declare export function autoComposeShallow<Props>(
    styletron: Styletron,
    styleArg: StyleObject | (Props => StyleObject)
  ): Styletron;
  declare export function autoComposeDeep<Props>(
    styletron: Styletron,
    styleArg: StyleObject | (Props => StyleObject)
  ): Styletron;
  declare export function staticComposeShallow(
    styletron: Styletron,
    style: StyleObject
  ): Styletron;
  declare export function staticComposeDeep(
    styletron: Styletron,
    style: StyleObject
  ): Styletron;
  declare export function dynamicComposeShallow<Props>(
    styletron: Styletron,
    styleFn: (Props) => StyleObject
  ): Styletron;
  declare export function dynamicComposeDeep<Props>(
    styletron: Styletron,
    styleFn: (Props) => StyleObject
  ): Styletron;
  declare export function createShallowMergeReducer(
    style: StyleObject
  ): AssignmentCommutativeReducerContainer;
  declare export function createDeepMergeReducer(
    style: StyleObject
  ): AssignmentCommutativeReducerContainer;
  declare export function composeStatic(
    styletron: Styletron,
    reducerContainer: AssignmentCommutativeReducerContainer
  ): Styletron;
  declare export function composeDynamic<Props>(
    styletron: Styletron,
    reducer: (StyleObject, Props) => StyleObject
  ): Styletron;
  declare export function createStyledElementComponent(
    styletron: Styletron
  ): any;
  declare export function resolveStyle(
    getInitialStyle: (void) => StyleObject,
    reducers: Array<ReducerContainer>,
    props: Object
  ): StyleObject;
}
