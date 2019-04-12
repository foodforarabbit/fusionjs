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
  +parameters: Object, // e.g. {}
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
};

export default class MorpheusClient implements IFeatureTogglesClient {
  ctx: Context;
  toggleNames: Array<string>;
  getTreatmentGroupsByNames: Function;
  experiments: {[experimentName: string]: MorpheusTreatmentGroupType};
  hasLoaded: boolean;
  enhanceContext: ?(
    ctx: Context,
    defaultMorpheusContext: MorpheusContextType
  ) => EnhancedMorpheusContextType;
  metadataTransform: ?(MorpheusTreatmentGroupType) => {+[string]: any};

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

    return this;
  }

  /*
   * Asynchronously loads all of the toggle details from those provided to the constructor.
   */
  async load() {
    this.experiments = await this.getExperiments(
      this.toggleNames,
      this.ctx,
      this.metadataTransform
    );
    this.hasLoaded = true;
  }

  /**
   * Gets whether the toggle is enabled, and optionally provides Morpheus-metadata if applicable.
   */
  async get(toggleName: string): Promise<ToggleDetailsType> {
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
    metadataTransform: ?(MorpheusTreatmentGroupType) => {+[string]: any}
  ): Promise<{+[experimentName: string]: MorpheusTreatmentGroupType}> {
    let result: MorpheusResponseType;
    try {
      result = (await this.getTreatmentGroupsByNames({
        experimentNames,
        context: this.getContext(ctx),
        disableLogging: true,
      }): MorpheusResponseType);
    } catch (e) {
      throw e;
    }

    // Transform metadata, if applicable
    let treatments = result.treatments;
    if (metadataTransform) {
      const transform = metadataTransform; // necessary to appease Flow
      treatments = Object.keys(treatments).reduce((result, key) => {
        const treatment = treatments[key];
        result[key] = transform(treatment);
        return result;
      }, {});
    }

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
    const defaultContext: MorpheusContextType = {
      browser: ctx.headers['user-agent'],
      url: ctx.url,
      urlParameters: ctx.query,
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
