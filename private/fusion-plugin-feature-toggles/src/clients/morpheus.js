// @flow

import type {Context} from 'fusion-core';

import type {IFeatureTogglesClient, ToggleDetailsType} from '../types.js';

type MorpheusContextType = {|
  browser: string,
  url: string,
  urlParameters: {[key: string]: string},
  deviceLanguage: string,
  ipAddress: string,
  cookieID: string,
|};

type MorpheusTreatmentGroupType = {|
  id: number, // e.g. 1125855
  name: string, // e.g. 'test_key'
  segmentUUID: string, // e.g. 'ab46b7e9-0669-4e77-86b6-5d47e7f239b4'
  experimentID: number, // e.g. 4368069
  experimentName: string, // e.g. 'amsmith_test_experiment'
  parameters: Object, // e.g. {}
  logTreatments: number, // e.g. 0
  segmentKey: string, // e.g. 'teamfooding'
  uuid: string, // e.g. '6ba9651b-5283-4277-a3d6-707e8365b1fb'
  bucketBy: string, // e.g. '$device'
  inclusionLoggingToken: string, // e.g. 'eyJ0cmVhdG1lbnRH..."
  segmentID: number, // e.g. 1126863
  morlogActivated: boolean, // e.g. false
  configNamespace: null,
  treatedUuids: null,
|};

type MorpheusResponseType = {|
  data: {
    experimentNames: Array<string>,
    context: MorpheusContextType,
    disableLogging: boolean,
  },
  treatments: {
    [experimentName: string]: MorpheusTreatmentGroupType,
  },
|};

export default class MorpheusClient implements IFeatureTogglesClient {
  ctx: Context;
  getTreatmentGroupsByNames: Function;
  experiments: {[experimentName: string]: MorpheusTreatmentGroupType};

  constructor(ctx: Context, params: {atreyu: any}) {
    const {atreyu} = params;
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
    this.getTreatmentGroupsByNames = atreyu.createAsyncGraph(graphDefinition);

    return this;
  }

  /**
   * Gets whether the toggle is enabled, and optionally provides Morpheus-metadata if applicable.
   */
  async get(toggleName: string): Promise<ToggleDetailsType> {
    // Lazily load experiments upon first request
    if (!this.experiments) {
      this.experiments = await this.getExperiments([toggleName], this.ctx);
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
    ctx: Context
  ): Promise<{[experimentName: string]: MorpheusTreatmentGroupType}> {
    const result: MorpheusResponseType = await this.getTreatmentGroupsByNames({
      experimentNames,
      context: this.getContext(ctx),
      disableLogging: true,
    });

    return result.treatments;
  }

  /**
   * Builds up the context used by Morpheus in order to properly identify
   * and segment this request.  Provides the following attributes:
   *   - browser {string} - browser client from the request
   *   - url {string} - request URL
   *   - urlParameters {{[key: string]: string}} - parameters embedded in the request URL
   *   - deviceLanguage {string} - Locale string from the request's 'accept-language' header
   *   - ipAddress {string} - IP address from the request
   *   - cookieID {string} - UUID4 corresponding to a specific user
   */
  getContext(ctx: Context): MorpheusContextType {
    return {
      browser: ctx.headers['user-agent'],
      url: ctx.url,
      urlParameters: ctx.query,
      deviceLanguage: ctx.headers['accept-language'],
      ipAddress: ctx.ip,
      cookieID:
        ctx.headers['user-uuid'] || '00000000-0000-0000-0000-0000000000000', // TODO Create a new cookie value if not found
    };
  }
}
