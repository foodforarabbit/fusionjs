// @flow

import type {Context} from 'fusion-core';

import type {IFeatureTogglesClient, ToggleDetailsType} from '../types.js';

export type MorpheusContextType = {
  +browser: string,
  +url: string,
  +urlParameters: {[key: string]: string},
  +deviceLanguage: string,
  +ipAddress: string,
  +cookieID: string,
};

type EnhancedMorpheusContextType = {+[string]: any};

type MorpheusTreatmentGroupType = {|
  +id: number, // e.g. 1125855
  +name: string, // e.g. 'test_key'
  +segmentUUID: string, // e.g. 'ab46b7e9-0669-4e77-86b6-5d47e7f239b4'
  +experimentID: number, // e.g. 4368069
  +experimentName: string, // e.g. 'amsmith_test_experiment'
  +parameters: {+[string]: mixed}, // e.g. {}
  +logTreatments: number, // e.g. 0
  +segmentKey: string, // e.g. 'teamfooding'
  +uuid: string, // e.g. '6ba9651b-5283-4277-a3d6-707e8365b1fb'
  +bucketBy: string, // e.g. '$device'
  +inclusionLoggingToken: string, // e.g. 'eyJ0cmVhdG1lbnRH..."
  +segmentID: number, // e.g. 1126863
  +morlogActivated: boolean, // e.g. false
  +configNamespace: null,
  +treatedUuids: null,
|};

type MorpheusResponseType = {|
  +data: {
    +experimentNames: Array<string>,
    +context: MorpheusContextType,
    +disableLogging: boolean,
  },
  +treatments: {
    +[experimentName: string]: MorpheusTreatmentGroupType,
  },
|};

type MorpheusConfigType = {
  +enhanceContext?: (
    ctx: Context,
    defaultMorpheusContext: MorpheusContextType
  ) => EnhancedMorpheusContextType,
  +metadataTransform?: MorpheusTreatmentGroupType => {+[string]: any},
  +timeoutThreshold?: number,
};

export default class MorpheusClient implements IFeatureTogglesClient {
  +ctx: Context;
  +toggleNames: Array<string>;
  +getTreatmentGroupsByNames: Function;
  +enhanceContext: ?(
    ctx: Context,
    defaultMorpheusContext: MorpheusContextType
  ) => EnhancedMorpheusContextType;
  +metadataTransform: ?(MorpheusTreatmentGroupType) => {+[string]: any};
  +timeoutThreshold: number;

  hasLoaded: boolean;
  experiments: {[experimentName: string]: MorpheusTreatmentGroupType};

  constructor(
    ctx: Context,
    toggleNames: Array<string>,
    deps: {atreyu: any},
    config: MorpheusConfigType
  ) {
    const {atreyu} = deps;
    const graphDefinition = {
      treatments: {
        service: 'treatment',
        method: 'Treatment::GetTreatmentGroupByNames',
        args: {
          experimentNames: '{data.experimentNames}',
          context: '{data.context}',
          disableLogging: '{data.disableLogging}',
        },
      },
    };

    this.ctx = ctx;
    this.toggleNames = toggleNames;
    this.enhanceContext = config.enhanceContext;
    this.getTreatmentGroupsByNames = atreyu.createAsyncGraph(graphDefinition);
    this.hasLoaded = false;
    this.metadataTransform = config.metadataTransform;
    this.timeoutThreshold = config.timeoutThreshold || 0;

    return this;
  }

  /*
   * Asynchronously loads all of the toggle details from those provided to the constructor.
   */
  async load() {
    this.experiments =
      (await resolveWithTimeout(
        this.getExperiments(this.toggleNames, this.ctx, this.metadataTransform),
        this.timeoutThreshold
      )) || {};
    this.hasLoaded = true;
  }

  /**
   * Gets whether the toggle is enabled, and optionally provides Morpheus-metadata if applicable.
   */
  get(toggleName: string): ToggleDetailsType {
    // Lazily load experiments upon first request
    if (!this.hasLoaded) {
      throw new Error('Ensure this service has been initialized via .load.');
    }
    if (!this.toggleNames.includes(toggleName)) {
      throw new Error(
        `Could not find provided toggle (${toggleName}).  Ensure it has been registered to FeatureTogglesToggleNamesToken.`
      );
    }

    const toggleDetails = this.experiments[toggleName];
    if (!toggleDetails) return {enabled: false}; // Not in the experiment.  Default to 'false';
    return {
      enabled: toggleDetails.name !== 'control',
      metadata: toggleDetails,
    };
  }

  /**
   * Requests experimentation data from Morpheus and provides the returned
   * treatment groups relevant to the specific request.
   */
  async getExperiments(
    experimentNames: Array<string>,
    ctx: Context,
    metadataTransform: ?(MorpheusTreatmentGroupType) => {+[string]: mixed}
  ): Promise<{+[experimentName: string]: MorpheusTreatmentGroupType | mixed}> {
    /* For security, if no metadataTransform is provided, default to stripping
     * out all metadata except those provided as parameters.
     */
    const defaultMetadataTransform = (
      metadata: MorpheusTreatmentGroupType
    ): {+[string]: mixed} =>
      metadata && metadata.parameters
        ? {
            parameters: metadata.parameters,
          }
        : {};
    const transform = metadataTransform || defaultMetadataTransform;

    // Attempt to resolve treatment details
    let result: MorpheusResponseType = (await this.getTreatmentGroupsByNames({
      experimentNames,
      context: this.getContext(ctx),
      disableLogging: true,
    }): MorpheusResponseType);

    // Transform metadata
    const treatments = Object.keys(result.treatments).reduce(
      (prev: {[string]: mixed}, key: string) => {
        const treatment = result.treatments[key];
        prev[key] = transform(treatment);
        return prev;
      },
      {}
    );

    return treatments;
  }

  /**
   * Builds up the context used by Morpheus in order to properly identify
   * and segment this request.  Provides the following attributes:
   *   - browser {string} - browser client from the request
   *   - url {string} - request URL
   *   - urlParameters {{[key: string]: string}} - parameters embedded in the request URL
   *   - deviceLanguage {string} - Locale string from the request's 'accept-language' header
   *   - ipAddress {string} - IP address from the request
   *   - cookieID {string} - UUID4 corresponding to a specific user, if available, otherwise
   *        the the user's 'marketing_vistor_id'.  Defaults to the empty string otherwise.
   */
  getContext(ctx: Context): MorpheusContextType | EnhancedMorpheusContextType {
    // ctx.query will roll entries with identical keys into an array which isn't supported by Morpheus backend
    const urlParams = Object.keys(ctx.query).reduce(function(result, key) {
      result[key] = Array.isArray(ctx.query[key])
        ? JSON.stringify(ctx.query[key])
        : ctx.query[key];
      return result;
    }, {});

    const defaultContext: MorpheusContextType = {
      browser: ctx.headers['user-agent'],
      url: ctx.url,
      urlParameters: urlParams,
      deviceLanguage: ctx.headers['accept-language'],
      ipAddress: ctx.ip,
      cookieID:
        ctx.headers['user-uuid'] ||
        ctx.cookies.get('marketing_vistor_id') ||
        '',
    };

    return this.enhanceContext
      ? this.enhanceContext(ctx, defaultContext)
      : defaultContext;
  }
}

/**
 * Helper to attempt to resolve the provided Promise.  If it cannot be resolved within the
 * provided timeout (in milliseconds), resolve to `void`.
 *
 * Note, a timeout of zero implies no limit on the time to complete the task.
 */
async function resolveWithTimeout<TResult>(
  task: Promise<TResult>,
  timeout: number
): Promise<TResult | void> {
  return timeout === 0 ? await task : Promise.race([task, delay(timeout)]);
}

/**
 * Helper that asynchronously delays for the provided time, ms, in milliseconds.
 */
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
