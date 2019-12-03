// @flow

/* istanbul ignore file */
// @generated
import thrift2flow$Long from 'long';
import type {OptionsType} from '@uber/typed-rpc-cli';
import type {Context as FusionContext} from 'fusion-core';
import type {GraphQLResolveInfo} from 'graphql';

export type UUID = string;
export type DateTime = Buffer;
export type Points = thrift2flow$Long;
export const NationalIdType: $ReadOnly<{|
  SPANISH_ID_OR_PASSPORT: 'SPANISH_ID_OR_PASSPORT',
|}> = Object.freeze({
  SPANISH_ID_OR_PASSPORT: 'SPANISH_ID_OR_PASSPORT',
});
export const UnauthorizedReason: $ReadOnly<{|
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INSUFFICIENT_PRIVILEGE: 'INSUFFICIENT_PRIVILEGE',
  USER_BANNED: 'USER_BANNED',
  INVALID_UUID: 'INVALID_UUID',
  SERVICE_NOT_WHITELISTED: 'SERVICE_NOT_WHITELISTED',
  MOBILE_IN_USE: 'MOBILE_IN_USE',
|}> = Object.freeze({
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INSUFFICIENT_PRIVILEGE: 'INSUFFICIENT_PRIVILEGE',
  USER_BANNED: 'USER_BANNED',
  INVALID_UUID: 'INVALID_UUID',
  SERVICE_NOT_WHITELISTED: 'SERVICE_NOT_WHITELISTED',
  MOBILE_IN_USE: 'MOBILE_IN_USE',
});
export const AddressType: $ReadOnly<{|
  PARTNER_INPUT_ADDRESS: 'PARTNER_INPUT_ADDRESS',
|}> = Object.freeze({
  PARTNER_INPUT_ADDRESS: 'PARTNER_INPUT_ADDRESS',
});
export const UserType: $ReadOnly<{|
  FLEET: 'FLEET',
  FREIGHT_CARRIER: 'FREIGHT_CARRIER',
  FREIGHT_DRIVER: 'FREIGHT_DRIVER',
  FREIGHT_FACTORING_COMPANY: 'FREIGHT_FACTORING_COMPANY',
  UNUSED_5: 'UNUSED_5',
  UNUSED_6: 'UNUSED_6',
  UNUSED_7: 'UNUSED_7',
  UNUSED_8: 'UNUSED_8',
  UNUSED_9: 'UNUSED_9',
  UNUSED_10: 'UNUSED_10',
  UNUSED_11: 'UNUSED_11',
  UNUSED_12: 'UNUSED_12',
  UNUSED_13: 'UNUSED_13',
  UNUSED_14: 'UNUSED_14',
  UNUSED_15: 'UNUSED_15',
  UNUSED_16: 'UNUSED_16',
  UNUSED_17: 'UNUSED_17',
  UNUSED_18: 'UNUSED_18',
  UNUSED_19: 'UNUSED_19',
  UNUSED_20: 'UNUSED_20',
  UNUSED_21: 'UNUSED_21',
  UNUSED_22: 'UNUSED_22',
  UNUSED_23: 'UNUSED_23',
  UNUSED_24: 'UNUSED_24',
  UNUSED_25: 'UNUSED_25',
  UNUSED_26: 'UNUSED_26',
  UNUSED_27: 'UNUSED_27',
  UNUSED_28: 'UNUSED_28',
  UNUSED_29: 'UNUSED_29',
  UNUSED_30: 'UNUSED_30',
  UNUSED_31: 'UNUSED_31',
  UNUSED_32: 'UNUSED_32',
|}> = Object.freeze({
  FLEET: 'FLEET',
  FREIGHT_CARRIER: 'FREIGHT_CARRIER',
  FREIGHT_DRIVER: 'FREIGHT_DRIVER',
  FREIGHT_FACTORING_COMPANY: 'FREIGHT_FACTORING_COMPANY',
  UNUSED_5: 'UNUSED_5',
  UNUSED_6: 'UNUSED_6',
  UNUSED_7: 'UNUSED_7',
  UNUSED_8: 'UNUSED_8',
  UNUSED_9: 'UNUSED_9',
  UNUSED_10: 'UNUSED_10',
  UNUSED_11: 'UNUSED_11',
  UNUSED_12: 'UNUSED_12',
  UNUSED_13: 'UNUSED_13',
  UNUSED_14: 'UNUSED_14',
  UNUSED_15: 'UNUSED_15',
  UNUSED_16: 'UNUSED_16',
  UNUSED_17: 'UNUSED_17',
  UNUSED_18: 'UNUSED_18',
  UNUSED_19: 'UNUSED_19',
  UNUSED_20: 'UNUSED_20',
  UNUSED_21: 'UNUSED_21',
  UNUSED_22: 'UNUSED_22',
  UNUSED_23: 'UNUSED_23',
  UNUSED_24: 'UNUSED_24',
  UNUSED_25: 'UNUSED_25',
  UNUSED_26: 'UNUSED_26',
  UNUSED_27: 'UNUSED_27',
  UNUSED_28: 'UNUSED_28',
  UNUSED_29: 'UNUSED_29',
  UNUSED_30: 'UNUSED_30',
  UNUSED_31: 'UNUSED_31',
  UNUSED_32: 'UNUSED_32',
});
export const DriverCompensationType: $ReadOnly<{|
  HOURLY: 'HOURLY',
  COMMISSION: 'COMMISSION',
|}> = Object.freeze({
  HOURLY: 'HOURLY',
  COMMISSION: 'COMMISSION',
});
export const PartnerStatus: $ReadOnly<{|
  APPLIED: 'APPLIED',
  ACTIVE: 'ACTIVE',
  REJECTED: 'REJECTED',
  INACTIVE: 'INACTIVE',
|}> = Object.freeze({
  APPLIED: 'APPLIED',
  ACTIVE: 'ACTIVE',
  REJECTED: 'REJECTED',
  INACTIVE: 'INACTIVE',
});
export type EntityAlreadyExists = {|
  message?: ?string,
  existingUuid?: ?UUID,
|};
export type EntityNotFound = {|
  message?: ?string,
|};
export type Unauthorized = {|
  message?: ?string,
  reason?: ?$Values<typeof UnauthorizedReason>,
|};
export type IndexingError = {|
  message?: ?string,
|};
export type AuthenticationError = {|
  message?: ?string,
|};
export type RateLimitedError = {|
  message?: ?string,
|};
export type ValidationError = {|
  messages?: ?{
    [string]: string,
  },
|};
export type UserMissingArgument = {|
  message?: ?string,
|};
export type UserDataConstraintClientException = {|
  message?: ?string,
|};
export type ThirdPartyAPIError = {|
  message?: ?string,
|};
export type AccountMissingMobileNumber = {||};
export type InternalServerError = {|
  message?: ?string,
|};
export const UserRole: $ReadOnly<{|
  CLIENT: 'CLIENT',
  DRIVER: 'DRIVER',
  PARTNER: 'PARTNER',
  MERCHANT: 'MERCHANT',
|}> = Object.freeze({
  CLIENT: 'CLIENT',
  DRIVER: 'DRIVER',
  PARTNER: 'PARTNER',
  MERCHANT: 'MERCHANT',
});
export const DriverStatus: $ReadOnly<{|
  ACTIVE: 'ACTIVE',
  PENDING_ONBOARDING: 'PENDING_ONBOARDING',
  READY_TO_ONBOARDING: 'READY_TO_ONBOARDING',
  ACCEPTED: 'ACCEPTED',
  INTERVIEWED: 'INTERVIEWED',
  PENDING_INTERVIEW: 'PENDING_INTERVIEW',
  READY_TO_INTERVIEW: 'READY_TO_INTERVIEW',
  APPLIED: 'APPLIED',
  WAITLISTED: 'WAITLISTED',
  REJECTED: 'REJECTED',
  WAITLISTED_FOR_MISSING_DOCS: 'WAITLISTED_FOR_MISSING_DOCS',
  WAITLISTED_AUTO_REACTIVATION: 'WAITLISTED_AUTO_REACTIVATION',
|}> = Object.freeze({
  ACTIVE: 'ACTIVE',
  PENDING_ONBOARDING: 'PENDING_ONBOARDING',
  READY_TO_ONBOARDING: 'READY_TO_ONBOARDING',
  ACCEPTED: 'ACCEPTED',
  INTERVIEWED: 'INTERVIEWED',
  PENDING_INTERVIEW: 'PENDING_INTERVIEW',
  READY_TO_INTERVIEW: 'READY_TO_INTERVIEW',
  APPLIED: 'APPLIED',
  WAITLISTED: 'WAITLISTED',
  REJECTED: 'REJECTED',
  WAITLISTED_FOR_MISSING_DOCS: 'WAITLISTED_FOR_MISSING_DOCS',
  WAITLISTED_AUTO_REACTIVATION: 'WAITLISTED_AUTO_REACTIVATION',
});
export const DriverFlowType: $ReadOnly<{|
  BLACK: 'BLACK',
  TAXI: 'TAXI',
  P2P: 'P2P',
  OTHER: 'OTHER',
  SUBURBS: 'SUBURBS',
  UBERX: 'UBERX',
  REMOTE: 'REMOTE',
  SUV: 'SUV',
  LOGISTICS: 'LOGISTICS',
  UBER_EATS: 'UBER_EATS',
  COMMUTE: 'COMMUTE',
  MOTORBIKE: 'MOTORBIKE',
  ONBOARDER: 'ONBOARDER',
  TEMPORARY: 'TEMPORARY',
  ATC: 'ATC',
  UBERFREIGHT: 'UBERFREIGHT',
  FLEET: 'FLEET',
  FLEETOPERATOR: 'FLEETOPERATOR',
  UBER_LITE: 'UBER_LITE',
  HOURLY_RENTALS: 'HOURLY_RENTALS',
  NEMOEARNER: 'NEMOEARNER',
  UNUSED_6: 'UNUSED_6',
  UNUSED_7: 'UNUSED_7',
  UNUSED_8: 'UNUSED_8',
  UNUSED_9: 'UNUSED_9',
  UNUSED_10: 'UNUSED_10',
  UNUSED_11: 'UNUSED_11',
  UNUSED_12: 'UNUSED_12',
  UNUSED_13: 'UNUSED_13',
  UNUSED_14: 'UNUSED_14',
  UNUSED_15: 'UNUSED_15',
  UNUSED_16: 'UNUSED_16',
  UNUSED_17: 'UNUSED_17',
  UNUSED_18: 'UNUSED_18',
  UNUSED_19: 'UNUSED_19',
  UNUSED_20: 'UNUSED_20',
  UNUSED_21: 'UNUSED_21',
  UNUSED_22: 'UNUSED_22',
  UNUSED_23: 'UNUSED_23',
  UNUSED_24: 'UNUSED_24',
  UNUSED_25: 'UNUSED_25',
  UNUSED_26: 'UNUSED_26',
  UNUSED_27: 'UNUSED_27',
  UNUSED_28: 'UNUSED_28',
  UNUSED_29: 'UNUSED_29',
  UNUSED_30: 'UNUSED_30',
  UNUSED_31: 'UNUSED_31',
  UNUSED_32: 'UNUSED_32',
  UNUSED_33: 'UNUSED_33',
  UNUSED_34: 'UNUSED_34',
  UNUSED_35: 'UNUSED_35',
  UNUSED_36: 'UNUSED_36',
  UNUSED_37: 'UNUSED_37',
  UNUSED_38: 'UNUSED_38',
  UNUSED_39: 'UNUSED_39',
  UNUSED_40: 'UNUSED_40',
  UNUSED_41: 'UNUSED_41',
  UNUSED_42: 'UNUSED_42',
  UNUSED_43: 'UNUSED_43',
  UNUSED_44: 'UNUSED_44',
  UNUSED_45: 'UNUSED_45',
  UNUSED_46: 'UNUSED_46',
  UNUSED_47: 'UNUSED_47',
  UNUSED_48: 'UNUSED_48',
  UNUSED_49: 'UNUSED_49',
  UNUSED_50: 'UNUSED_50',
  UNUSED_51: 'UNUSED_51',
  UNUSED_52: 'UNUSED_52',
  UNUSED_53: 'UNUSED_53',
  UNUSED_54: 'UNUSED_54',
  UNUSED_55: 'UNUSED_55',
  UNUSED_56: 'UNUSED_56',
  UNUSED_57: 'UNUSED_57',
  UNUSED_58: 'UNUSED_58',
  UNUSED_59: 'UNUSED_59',
  UNUSED_60: 'UNUSED_60',
  UNUSED_61: 'UNUSED_61',
  UNUSED_62: 'UNUSED_62',
  UNUSED_63: 'UNUSED_63',
  UNUSED_64: 'UNUSED_64',
  UNUSED_65: 'UNUSED_65',
  UNUSED_66: 'UNUSED_66',
  UNUSED_67: 'UNUSED_67',
  UNUSED_68: 'UNUSED_68',
  UNUSED_69: 'UNUSED_69',
  UNUSED_70: 'UNUSED_70',
  UNUSED_71: 'UNUSED_71',
  UNUSED_72: 'UNUSED_72',
  UNUSED_73: 'UNUSED_73',
  UNUSED_74: 'UNUSED_74',
  UNUSED_75: 'UNUSED_75',
  UNUSED_76: 'UNUSED_76',
  UNUSED_77: 'UNUSED_77',
  UNUSED_78: 'UNUSED_78',
  UNUSED_79: 'UNUSED_79',
  UNUSED_80: 'UNUSED_80',
  UNUSED_81: 'UNUSED_81',
  UNUSED_82: 'UNUSED_82',
  UNUSED_83: 'UNUSED_83',
  UNUSED_84: 'UNUSED_84',
  UNUSED_85: 'UNUSED_85',
  UNUSED_86: 'UNUSED_86',
  UNUSED_87: 'UNUSED_87',
  UNUSED_88: 'UNUSED_88',
  UNUSED_89: 'UNUSED_89',
  UNUSED_90: 'UNUSED_90',
  UNUSED_91: 'UNUSED_91',
  UNUSED_92: 'UNUSED_92',
  UNUSED_93: 'UNUSED_93',
  UNUSED_94: 'UNUSED_94',
  UNUSED_95: 'UNUSED_95',
  UNUSED_96: 'UNUSED_96',
  UNUSED_97: 'UNUSED_97',
  UNUSED_98: 'UNUSED_98',
  UNUSED_99: 'UNUSED_99',
  UNUSED_100: 'UNUSED_100',
  UNUSED_101: 'UNUSED_101',
  UNUSED_102: 'UNUSED_102',
  UNUSED_103: 'UNUSED_103',
  UNUSED_104: 'UNUSED_104',
  UNUSED_105: 'UNUSED_105',
  UNUSED_106: 'UNUSED_106',
  UNUSED_107: 'UNUSED_107',
  UNUSED_108: 'UNUSED_108',
  UNUSED_109: 'UNUSED_109',
  UNUSED_110: 'UNUSED_110',
  UNUSED_111: 'UNUSED_111',
  UNUSED_112: 'UNUSED_112',
  UNUSED_113: 'UNUSED_113',
  UNUSED_114: 'UNUSED_114',
  UNUSED_115: 'UNUSED_115',
  UNUSED_116: 'UNUSED_116',
  UNUSED_117: 'UNUSED_117',
  UNUSED_118: 'UNUSED_118',
  UNUSED_119: 'UNUSED_119',
  UNUSED_120: 'UNUSED_120',
  UNUSED_121: 'UNUSED_121',
  UNUSED_122: 'UNUSED_122',
  UNUSED_123: 'UNUSED_123',
  UNUSED_124: 'UNUSED_124',
  UNUSED_125: 'UNUSED_125',
  UNUSED_126: 'UNUSED_126',
  UNUSED_127: 'UNUSED_127',
  UNUSED_128: 'UNUSED_128',
  UNUSED_129: 'UNUSED_129',
  UNUSED_130: 'UNUSED_130',
  UNUSED_131: 'UNUSED_131',
  UNUSED_132: 'UNUSED_132',
  UNUSED_133: 'UNUSED_133',
  UNUSED_134: 'UNUSED_134',
  UNUSED_135: 'UNUSED_135',
  UNUSED_136: 'UNUSED_136',
  UNUSED_137: 'UNUSED_137',
  UNUSED_138: 'UNUSED_138',
  UNUSED_139: 'UNUSED_139',
  UNUSED_140: 'UNUSED_140',
  UNUSED_141: 'UNUSED_141',
  UNUSED_142: 'UNUSED_142',
  UNUSED_143: 'UNUSED_143',
  UNUSED_144: 'UNUSED_144',
  UNUSED_145: 'UNUSED_145',
  UNUSED_146: 'UNUSED_146',
  UNUSED_147: 'UNUSED_147',
  UNUSED_148: 'UNUSED_148',
  UNUSED_149: 'UNUSED_149',
  UNUSED_150: 'UNUSED_150',
  UNUSED_151: 'UNUSED_151',
  UNUSED_152: 'UNUSED_152',
  UNUSED_153: 'UNUSED_153',
  UNUSED_154: 'UNUSED_154',
  UNUSED_155: 'UNUSED_155',
  UNUSED_156: 'UNUSED_156',
  UNUSED_157: 'UNUSED_157',
  UNUSED_158: 'UNUSED_158',
  UNUSED_159: 'UNUSED_159',
  UNUSED_160: 'UNUSED_160',
  UNUSED_161: 'UNUSED_161',
  UNUSED_162: 'UNUSED_162',
  UNUSED_163: 'UNUSED_163',
  UNUSED_164: 'UNUSED_164',
  UNUSED_165: 'UNUSED_165',
  UNUSED_166: 'UNUSED_166',
  UNUSED_167: 'UNUSED_167',
  UNUSED_168: 'UNUSED_168',
  UNUSED_169: 'UNUSED_169',
  UNUSED_170: 'UNUSED_170',
  UNUSED_171: 'UNUSED_171',
  UNUSED_172: 'UNUSED_172',
  UNUSED_173: 'UNUSED_173',
  UNUSED_174: 'UNUSED_174',
  UNUSED_175: 'UNUSED_175',
  UNUSED_176: 'UNUSED_176',
  UNUSED_177: 'UNUSED_177',
  UNUSED_178: 'UNUSED_178',
  UNUSED_179: 'UNUSED_179',
  UNUSED_180: 'UNUSED_180',
  UNUSED_181: 'UNUSED_181',
  UNUSED_182: 'UNUSED_182',
  UNUSED_183: 'UNUSED_183',
  UNUSED_184: 'UNUSED_184',
  UNUSED_185: 'UNUSED_185',
  UNUSED_186: 'UNUSED_186',
  UNUSED_187: 'UNUSED_187',
  UNUSED_188: 'UNUSED_188',
  UNUSED_189: 'UNUSED_189',
  UNUSED_190: 'UNUSED_190',
  UNUSED_191: 'UNUSED_191',
  UNUSED_192: 'UNUSED_192',
  UNUSED_193: 'UNUSED_193',
  UNUSED_194: 'UNUSED_194',
  UNUSED_195: 'UNUSED_195',
  UNUSED_196: 'UNUSED_196',
  UNUSED_197: 'UNUSED_197',
  UNUSED_198: 'UNUSED_198',
  UNUSED_199: 'UNUSED_199',
  UNUSED_200: 'UNUSED_200',
|}> = Object.freeze({
  BLACK: 'BLACK',
  TAXI: 'TAXI',
  P2P: 'P2P',
  OTHER: 'OTHER',
  SUBURBS: 'SUBURBS',
  UBERX: 'UBERX',
  REMOTE: 'REMOTE',
  SUV: 'SUV',
  LOGISTICS: 'LOGISTICS',
  UBER_EATS: 'UBER_EATS',
  COMMUTE: 'COMMUTE',
  MOTORBIKE: 'MOTORBIKE',
  ONBOARDER: 'ONBOARDER',
  TEMPORARY: 'TEMPORARY',
  ATC: 'ATC',
  UBERFREIGHT: 'UBERFREIGHT',
  FLEET: 'FLEET',
  FLEETOPERATOR: 'FLEETOPERATOR',
  UBER_LITE: 'UBER_LITE',
  HOURLY_RENTALS: 'HOURLY_RENTALS',
  NEMOEARNER: 'NEMOEARNER',
  UNUSED_6: 'UNUSED_6',
  UNUSED_7: 'UNUSED_7',
  UNUSED_8: 'UNUSED_8',
  UNUSED_9: 'UNUSED_9',
  UNUSED_10: 'UNUSED_10',
  UNUSED_11: 'UNUSED_11',
  UNUSED_12: 'UNUSED_12',
  UNUSED_13: 'UNUSED_13',
  UNUSED_14: 'UNUSED_14',
  UNUSED_15: 'UNUSED_15',
  UNUSED_16: 'UNUSED_16',
  UNUSED_17: 'UNUSED_17',
  UNUSED_18: 'UNUSED_18',
  UNUSED_19: 'UNUSED_19',
  UNUSED_20: 'UNUSED_20',
  UNUSED_21: 'UNUSED_21',
  UNUSED_22: 'UNUSED_22',
  UNUSED_23: 'UNUSED_23',
  UNUSED_24: 'UNUSED_24',
  UNUSED_25: 'UNUSED_25',
  UNUSED_26: 'UNUSED_26',
  UNUSED_27: 'UNUSED_27',
  UNUSED_28: 'UNUSED_28',
  UNUSED_29: 'UNUSED_29',
  UNUSED_30: 'UNUSED_30',
  UNUSED_31: 'UNUSED_31',
  UNUSED_32: 'UNUSED_32',
  UNUSED_33: 'UNUSED_33',
  UNUSED_34: 'UNUSED_34',
  UNUSED_35: 'UNUSED_35',
  UNUSED_36: 'UNUSED_36',
  UNUSED_37: 'UNUSED_37',
  UNUSED_38: 'UNUSED_38',
  UNUSED_39: 'UNUSED_39',
  UNUSED_40: 'UNUSED_40',
  UNUSED_41: 'UNUSED_41',
  UNUSED_42: 'UNUSED_42',
  UNUSED_43: 'UNUSED_43',
  UNUSED_44: 'UNUSED_44',
  UNUSED_45: 'UNUSED_45',
  UNUSED_46: 'UNUSED_46',
  UNUSED_47: 'UNUSED_47',
  UNUSED_48: 'UNUSED_48',
  UNUSED_49: 'UNUSED_49',
  UNUSED_50: 'UNUSED_50',
  UNUSED_51: 'UNUSED_51',
  UNUSED_52: 'UNUSED_52',
  UNUSED_53: 'UNUSED_53',
  UNUSED_54: 'UNUSED_54',
  UNUSED_55: 'UNUSED_55',
  UNUSED_56: 'UNUSED_56',
  UNUSED_57: 'UNUSED_57',
  UNUSED_58: 'UNUSED_58',
  UNUSED_59: 'UNUSED_59',
  UNUSED_60: 'UNUSED_60',
  UNUSED_61: 'UNUSED_61',
  UNUSED_62: 'UNUSED_62',
  UNUSED_63: 'UNUSED_63',
  UNUSED_64: 'UNUSED_64',
  UNUSED_65: 'UNUSED_65',
  UNUSED_66: 'UNUSED_66',
  UNUSED_67: 'UNUSED_67',
  UNUSED_68: 'UNUSED_68',
  UNUSED_69: 'UNUSED_69',
  UNUSED_70: 'UNUSED_70',
  UNUSED_71: 'UNUSED_71',
  UNUSED_72: 'UNUSED_72',
  UNUSED_73: 'UNUSED_73',
  UNUSED_74: 'UNUSED_74',
  UNUSED_75: 'UNUSED_75',
  UNUSED_76: 'UNUSED_76',
  UNUSED_77: 'UNUSED_77',
  UNUSED_78: 'UNUSED_78',
  UNUSED_79: 'UNUSED_79',
  UNUSED_80: 'UNUSED_80',
  UNUSED_81: 'UNUSED_81',
  UNUSED_82: 'UNUSED_82',
  UNUSED_83: 'UNUSED_83',
  UNUSED_84: 'UNUSED_84',
  UNUSED_85: 'UNUSED_85',
  UNUSED_86: 'UNUSED_86',
  UNUSED_87: 'UNUSED_87',
  UNUSED_88: 'UNUSED_88',
  UNUSED_89: 'UNUSED_89',
  UNUSED_90: 'UNUSED_90',
  UNUSED_91: 'UNUSED_91',
  UNUSED_92: 'UNUSED_92',
  UNUSED_93: 'UNUSED_93',
  UNUSED_94: 'UNUSED_94',
  UNUSED_95: 'UNUSED_95',
  UNUSED_96: 'UNUSED_96',
  UNUSED_97: 'UNUSED_97',
  UNUSED_98: 'UNUSED_98',
  UNUSED_99: 'UNUSED_99',
  UNUSED_100: 'UNUSED_100',
  UNUSED_101: 'UNUSED_101',
  UNUSED_102: 'UNUSED_102',
  UNUSED_103: 'UNUSED_103',
  UNUSED_104: 'UNUSED_104',
  UNUSED_105: 'UNUSED_105',
  UNUSED_106: 'UNUSED_106',
  UNUSED_107: 'UNUSED_107',
  UNUSED_108: 'UNUSED_108',
  UNUSED_109: 'UNUSED_109',
  UNUSED_110: 'UNUSED_110',
  UNUSED_111: 'UNUSED_111',
  UNUSED_112: 'UNUSED_112',
  UNUSED_113: 'UNUSED_113',
  UNUSED_114: 'UNUSED_114',
  UNUSED_115: 'UNUSED_115',
  UNUSED_116: 'UNUSED_116',
  UNUSED_117: 'UNUSED_117',
  UNUSED_118: 'UNUSED_118',
  UNUSED_119: 'UNUSED_119',
  UNUSED_120: 'UNUSED_120',
  UNUSED_121: 'UNUSED_121',
  UNUSED_122: 'UNUSED_122',
  UNUSED_123: 'UNUSED_123',
  UNUSED_124: 'UNUSED_124',
  UNUSED_125: 'UNUSED_125',
  UNUSED_126: 'UNUSED_126',
  UNUSED_127: 'UNUSED_127',
  UNUSED_128: 'UNUSED_128',
  UNUSED_129: 'UNUSED_129',
  UNUSED_130: 'UNUSED_130',
  UNUSED_131: 'UNUSED_131',
  UNUSED_132: 'UNUSED_132',
  UNUSED_133: 'UNUSED_133',
  UNUSED_134: 'UNUSED_134',
  UNUSED_135: 'UNUSED_135',
  UNUSED_136: 'UNUSED_136',
  UNUSED_137: 'UNUSED_137',
  UNUSED_138: 'UNUSED_138',
  UNUSED_139: 'UNUSED_139',
  UNUSED_140: 'UNUSED_140',
  UNUSED_141: 'UNUSED_141',
  UNUSED_142: 'UNUSED_142',
  UNUSED_143: 'UNUSED_143',
  UNUSED_144: 'UNUSED_144',
  UNUSED_145: 'UNUSED_145',
  UNUSED_146: 'UNUSED_146',
  UNUSED_147: 'UNUSED_147',
  UNUSED_148: 'UNUSED_148',
  UNUSED_149: 'UNUSED_149',
  UNUSED_150: 'UNUSED_150',
  UNUSED_151: 'UNUSED_151',
  UNUSED_152: 'UNUSED_152',
  UNUSED_153: 'UNUSED_153',
  UNUSED_154: 'UNUSED_154',
  UNUSED_155: 'UNUSED_155',
  UNUSED_156: 'UNUSED_156',
  UNUSED_157: 'UNUSED_157',
  UNUSED_158: 'UNUSED_158',
  UNUSED_159: 'UNUSED_159',
  UNUSED_160: 'UNUSED_160',
  UNUSED_161: 'UNUSED_161',
  UNUSED_162: 'UNUSED_162',
  UNUSED_163: 'UNUSED_163',
  UNUSED_164: 'UNUSED_164',
  UNUSED_165: 'UNUSED_165',
  UNUSED_166: 'UNUSED_166',
  UNUSED_167: 'UNUSED_167',
  UNUSED_168: 'UNUSED_168',
  UNUSED_169: 'UNUSED_169',
  UNUSED_170: 'UNUSED_170',
  UNUSED_171: 'UNUSED_171',
  UNUSED_172: 'UNUSED_172',
  UNUSED_173: 'UNUSED_173',
  UNUSED_174: 'UNUSED_174',
  UNUSED_175: 'UNUSED_175',
  UNUSED_176: 'UNUSED_176',
  UNUSED_177: 'UNUSED_177',
  UNUSED_178: 'UNUSED_178',
  UNUSED_179: 'UNUSED_179',
  UNUSED_180: 'UNUSED_180',
  UNUSED_181: 'UNUSED_181',
  UNUSED_182: 'UNUSED_182',
  UNUSED_183: 'UNUSED_183',
  UNUSED_184: 'UNUSED_184',
  UNUSED_185: 'UNUSED_185',
  UNUSED_186: 'UNUSED_186',
  UNUSED_187: 'UNUSED_187',
  UNUSED_188: 'UNUSED_188',
  UNUSED_189: 'UNUSED_189',
  UNUSED_190: 'UNUSED_190',
  UNUSED_191: 'UNUSED_191',
  UNUSED_192: 'UNUSED_192',
  UNUSED_193: 'UNUSED_193',
  UNUSED_194: 'UNUSED_194',
  UNUSED_195: 'UNUSED_195',
  UNUSED_196: 'UNUSED_196',
  UNUSED_197: 'UNUSED_197',
  UNUSED_198: 'UNUSED_198',
  UNUSED_199: 'UNUSED_199',
  UNUSED_200: 'UNUSED_200',
});
export type NullableString = {|
  strValue?: ?string,
|};
export type NullableI32 = {|
  int32Value?: ?number,
|};
export type NullableDouble = {|
  doubleValue?: ?number,
|};
export type NullableBool = {|
  boolValue?: ?boolean,
|};
export type NullableUUID = {|
  uuidValue?: ?UUID,
|};
export const ThirdPartyIdentityType: $ReadOnly<{|
  AlipayIdentity: 'AlipayIdentity',
  FacebookIdentity: 'FacebookIdentity',
  ConcurIdentity: 'ConcurIdentity',
  SpotifyIdentity: 'SpotifyIdentity',
  AppleIdentity: 'AppleIdentity',
  RdioIdentity: 'RdioIdentity',
  BaiduIdentity: 'BaiduIdentity',
  WechatIdentity: 'WechatIdentity',
  PandoraIdentity: 'PandoraIdentity',
  GoogleIdentity: 'GoogleIdentity',
  LineIdentity: 'LineIdentity',
  IdmeIdentity: 'IdmeIdentity',
  FacebookUberPageIdentity: 'FacebookUberPageIdentity',
  YandexIdentity: 'YandexIdentity',
  TaxiDriverIdentity: 'TaxiDriverIdentity',
  MasabiIdentity: 'MasabiIdentity',
|}> = Object.freeze({
  AlipayIdentity: 'AlipayIdentity',
  FacebookIdentity: 'FacebookIdentity',
  ConcurIdentity: 'ConcurIdentity',
  SpotifyIdentity: 'SpotifyIdentity',
  AppleIdentity: 'AppleIdentity',
  RdioIdentity: 'RdioIdentity',
  BaiduIdentity: 'BaiduIdentity',
  WechatIdentity: 'WechatIdentity',
  PandoraIdentity: 'PandoraIdentity',
  GoogleIdentity: 'GoogleIdentity',
  LineIdentity: 'LineIdentity',
  IdmeIdentity: 'IdmeIdentity',
  FacebookUberPageIdentity: 'FacebookUberPageIdentity',
  YandexIdentity: 'YandexIdentity',
  TaxiDriverIdentity: 'TaxiDriverIdentity',
  MasabiIdentity: 'MasabiIdentity',
});
export type AddressInfo = {|
  name?: ?string,
  street1?: ?string,
  street2?: ?string,
  city?: ?string,
  state?: ?string,
  countryId?: ?number,
  zipcode?: ?string,
|};
export type Address = {|
  addressUuid?: ?UUID,
  addressType?: ?$Values<typeof AddressType>,
  name?: ?string,
  street1?: ?string,
  street2?: ?string,
  city?: ?string,
  state?: ?string,
  countryId?: ?number,
  zipcode?: ?string,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  deletedAt?: ?DateTime,
|};
export type FreightUserPermissions = {|
  canSeePrice?: ?boolean,
  canBookLoad?: ?boolean,
|};
export type FreightInfo = {|
  fleetSize?: ?number,
  fleetSizeDescription?: ?string,
  mcOrDotNumber?: ?string,
  carrierPacketUrl?: ?string,
  role?: ?string,
  carrierUserUuid?: ?UUID,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  deletedAt?: ?DateTime,
  carrierStatus?: ?$Values<typeof FreightCarrierStatus>,
  mcNumber?: ?string,
  dotNumber?: ?string,
  userStatus?: ?$Values<typeof FreightUserStatus>,
  userRole?: ?$Values<typeof FreightUserRole>,
  createPasswordNotificationLastSentBy?: ?UUID,
  createPasswordNotificationLastSentTime?: ?DateTime,
  externalVerificationEmail?: ?string,
  isExternalEmailVerified?: ?boolean,
  permissions?: ?FreightUserPermissions,
|};
export type AttributionMetadata = {|
  name?: ?string,
  value?: ?string,
|};
export type AttributionSubChannel = {|
  name?: ?string,
  value?: ?string,
|};
export type MarketingAttributedEvent = {|
  eventType?: ?string,
  channel?: ?string,
  subChannels?: ?(AttributionSubChannel[]),
  source?: ?string,
  spendRecordedAt?: ?DateTime,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  clickTimestamp?: ?DateTime,
  channelGroup?: ?string,
  platform?: ?string,
  subPlatform?: ?string,
  referringDomain?: ?string,
  uberAdId?: ?string,
  impressionTimestamp?: ?DateTime,
  metadata?: ?(AttributionMetadata[]),
|};
export type MarketingAttributedEventSelector = {|
  eventType?: ?string,
  channel?: ?string,
  source?: ?string,
  createdAt?: ?DateTime,
|};
export type UpdateMarketingAttributedEventRequest = {|
  userUuid?: ?UUID,
  selector?: ?MarketingAttributedEventSelector,
  updatedEvent?: ?MarketingAttributedEvent,
|};
export type UserAttribute = {|
  key: string,
  value?: ?string,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  deletedAt?: ?DateTime,
|};
export type UserEmail = {|
  email: string,
  confirmationToken?: ?string,
  isConfirmed?: ?boolean,
  paymentProfileUuid?: ?UUID,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
|};
export type UserEmails = {|
  emails: UserEmail[],
|};
export type UserNote = {|
  note: string,
  createdByUserUuid?: ?UUID,
  updatedByUserUuid?: ?UUID,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  deletedAt?: ?DateTime,
  id?: ?string,
|};
export type DriverStatusEntity = {|
  driverStatus?: ?$Values<typeof DriverStatus>,
  notes?: ?string,
  createdByUserUuid?: ?UUID,
  updatedByUserUuid?: ?UUID,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  id?: ?string,
|};
export type PaymentProfileByProduct = {|
  product?: ?$Values<typeof Product>,
  paymentProfileUUID?: ?UUID,
|};
export type UpdateUserInfoRequest = {|
  firstname?: ?string,
  lastname?: ?string,
  location?: ?string,
  countryId?: ?number,
  languageId?: ?number,
  nickname?: ?string,
  gratuity?: ?number,
  email?: ?string,
  mobile?: ?string,
  mobileCountryIso2?: ?string,
  isExemptedFromConfirmingMobile?: ?boolean,
  deviceId?: ?string,
  cardio?: ?boolean,
  lastSelectedPaymentProfileUuid?: ?UUID,
  dateOfBirth?: ?DateTime,
  preferredName?: ?string,
  identityVerified?: ?boolean,
  paymentEntityType?: ?string,
  identityRejectReasonUuid?: ?UUID,
  genderInferred?: ?$Values<typeof GenderType>,
  genderIdentity?: ?$Values<typeof GenderType>,
  genderDocumented?: ?$Values<typeof GenderType>,
  riderIneligibleWdw?: ?boolean,
  defaultPaymentProfileByProduct?: ?(PaymentProfileByProduct[]),
|};
export type UpdateDriverInfoRequest = {|
  iphone?: ?string,
  receiveSms?: ?boolean,
  twilioNumber?: ?string,
  twilioNumberFormatted?: ?string,
  contactinfo?: ?string,
  contactinfoCountryCode?: ?string,
  driverType?: ?$Values<typeof DriverCompensationType>,
|};
export type UpdateDriverStatusRequest = {|
  driverStatusEntity?: ?DriverStatusEntity,
|};
export type UpdatePartnerInfoRequest = {|
  company?: ?string,
  cityId?: ?number,
  state?: ?string,
  zipcode?: ?string,
  cityName?: ?string,
  vatNumber?: ?string,
  address?: ?string,
  address2?: ?string,
  preferredCollectionPaymentProfileUuid?: ?UUID,
  partnerStatus?: ?$Values<typeof PartnerStatus>,
  fleetTypes?: ?($Values<typeof FleetType>[]),
  fleetServices?: ?($Values<typeof FleetService>[]),
  isFleet?: ?boolean,
|};
export type UpdateFreightInfoRequest = {|
  fleetSize?: ?number,
  fleetSizeDescription?: ?string,
  mcOrDotNumber?: ?string,
  carrierPacketUrl?: ?string,
  role?: ?string,
  carrierUserUuid?: ?UUID,
  carrierStatus?: ?$Values<typeof FreightCarrierStatus>,
  mcNumber?: ?string,
  dotNumber?: ?string,
  userStatus?: ?$Values<typeof FreightUserStatus>,
  userRole?: ?$Values<typeof FreightUserRole>,
  createPasswordNotificationLastSentBy?: ?UUID,
  createPasswordNotificationLastSentTime?: ?DateTime,
  externalVerificationEmail?: ?string,
  isExternalEmailVerified?: ?boolean,
  permissions?: ?FreightUserPermissions,
|};
export type UpdateNationalIdRequest = {|
  nationalId: string,
  nationalIdType: $Values<typeof NationalIdType>,
|};
export const BusinessType: $ReadOnly<{|
  RESTAURANT_TAKEOUT: 'RESTAURANT_TAKEOUT',
  RETAIL_SHOPPING: 'RETAIL_SHOPPING',
  GROCERY_SPECIALTY: 'GROCERY_SPECIALTY',
  FLORIST: 'FLORIST',
  PROFESSIONAL_CREATIVE: 'PROFESSIONAL_CREATIVE',
  REAL_ESTATE: 'REAL_ESTATE',
  REPAIRS_CLEANING: 'REPAIRS_CLEANING',
  WHOLESALE_TRADE: 'WHOLESALE_TRADE',
  OTHER: 'OTHER',
|}> = Object.freeze({
  RESTAURANT_TAKEOUT: 'RESTAURANT_TAKEOUT',
  RETAIL_SHOPPING: 'RETAIL_SHOPPING',
  GROCERY_SPECIALTY: 'GROCERY_SPECIALTY',
  FLORIST: 'FLORIST',
  PROFESSIONAL_CREATIVE: 'PROFESSIONAL_CREATIVE',
  REAL_ESTATE: 'REAL_ESTATE',
  REPAIRS_CLEANING: 'REPAIRS_CLEANING',
  WHOLESALE_TRADE: 'WHOLESALE_TRADE',
  OTHER: 'OTHER',
});
export const MerchantLocationType: $ReadOnly<{|
  LOCATION: 'LOCATION',
  BUSINESS: 'BUSINESS',
|}> = Object.freeze({
  LOCATION: 'LOCATION',
  BUSINESS: 'BUSINESS',
});
export const FreightUserStatus: $ReadOnly<{|
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE',
  SIGNED_UP: 'SIGNED_UP',
  INITIATED: 'INITIATED',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
|}> = Object.freeze({
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE',
  SIGNED_UP: 'SIGNED_UP',
  INITIATED: 'INITIATED',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
});
export const FreightUserRole: $ReadOnly<{|
  DRIVER: 'DRIVER',
  DISPATCHER: 'DISPATCHER',
  DRIVER_DISPATCHER: 'DRIVER_DISPATCHER',
  FACTORING_COMPANY: 'FACTORING_COMPANY',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
|}> = Object.freeze({
  DRIVER: 'DRIVER',
  DISPATCHER: 'DISPATCHER',
  DRIVER_DISPATCHER: 'DRIVER_DISPATCHER',
  FACTORING_COMPANY: 'FACTORING_COMPANY',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
});
export const FreightCarrierStatus: $ReadOnly<{|
  INITIATED: 'INITIATED',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE',
  SIGNED_UP: 'SIGNED_UP',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
  UNUSED_TYPE11: 'UNUSED_TYPE11',
|}> = Object.freeze({
  INITIATED: 'INITIATED',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE',
  SIGNED_UP: 'SIGNED_UP',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
  UNUSED_TYPE11: 'UNUSED_TYPE11',
});
export const FleetType: $ReadOnly<{|
  RENTAL: 'RENTAL',
  TRANSPORTATION: 'TRANSPORTATION',
  CONNECTOR: 'CONNECTOR',
  UNUSED_TYPE4: 'UNUSED_TYPE4',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
  UNUSED_TYPE11: 'UNUSED_TYPE11',
  UNUSED_TYPE12: 'UNUSED_TYPE12',
|}> = Object.freeze({
  RENTAL: 'RENTAL',
  TRANSPORTATION: 'TRANSPORTATION',
  CONNECTOR: 'CONNECTOR',
  UNUSED_TYPE4: 'UNUSED_TYPE4',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
  UNUSED_TYPE11: 'UNUSED_TYPE11',
  UNUSED_TYPE12: 'UNUSED_TYPE12',
});
export const FleetService: $ReadOnly<{|
  ONBOARDING: 'ONBOARDING',
  ENABLEMENT: 'ENABLEMENT',
  SUPPORT: 'SUPPORT',
  PAYMENTS: 'PAYMENTS',
  FINANCE: 'FINANCE',
  OTHER: 'OTHER',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
  UNUSED_TYPE11: 'UNUSED_TYPE11',
  UNUSED_TYPE12: 'UNUSED_TYPE12',
|}> = Object.freeze({
  ONBOARDING: 'ONBOARDING',
  ENABLEMENT: 'ENABLEMENT',
  SUPPORT: 'SUPPORT',
  PAYMENTS: 'PAYMENTS',
  FINANCE: 'FINANCE',
  OTHER: 'OTHER',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
  UNUSED_TYPE11: 'UNUSED_TYPE11',
  UNUSED_TYPE12: 'UNUSED_TYPE12',
});
export type MerchantLocation = {|
  uuid?: ?UUID,
  maxDeliveryRadius?: ?number,
  deliveryInstruction?: ?string,
  priceBucket?: ?string,
  deliveryFee?: ?number,
  averagePrepareTime?: ?number,
  tenancy?: ?string,
  email?: ?string,
  phone?: ?string,
  longitude?: ?number,
  latitude?: ?number,
  merchantName?: ?string,
  businessType?: ?$Values<typeof BusinessType>,
  countryId?: ?number,
  territoryUUID?: ?UUID,
  regionId?: ?number,
  timezone?: ?string,
  timezoneOffsetSeconds?: ?number,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  type?: ?$Values<typeof MerchantLocationType>,
|};
export const ProfileType: $ReadOnly<{|
  Personal: 'Personal',
  Business: 'Business',
  ManagedBusiness: 'ManagedBusiness',
  ManagedFamily: 'ManagedFamily',
  Commuter: 'Commuter',
|}> = Object.freeze({
  Personal: 'Personal',
  Business: 'Business',
  ManagedBusiness: 'ManagedBusiness',
  ManagedFamily: 'ManagedFamily',
  Commuter: 'Commuter',
});
export const BillingMode: $ReadOnly<{|
  Centralized: 'Centralized',
  Decentralized: 'Decentralized',
|}> = Object.freeze({
  Centralized: 'Centralized',
  Decentralized: 'Decentralized',
});
export const SummaryPeriod: $ReadOnly<{|
  Weekly: 'Weekly',
  Monthly: 'Monthly',
|}> = Object.freeze({
  Weekly: 'Weekly',
  Monthly: 'Monthly',
});
export const ExpenseProvider: $ReadOnly<{|
  EXPENSIFY: 'EXPENSIFY',
  CONCUR: 'CONCUR',
  CERTIFY: 'CERTIFY',
  CHROME_RIVER: 'CHROME_RIVER',
|}> = Object.freeze({
  EXPENSIFY: 'EXPENSIFY',
  CONCUR: 'CONCUR',
  CERTIFY: 'CERTIFY',
  CHROME_RIVER: 'CHROME_RIVER',
});
export const ExpenseProviderV2: $ReadOnly<{|
  EXPENSIFY: 'EXPENSIFY',
  CONCUR: 'CONCUR',
  CERTIFY: 'CERTIFY',
  CHROME_RIVER: 'CHROME_RIVER',
  SERKO_ZENO: 'SERKO_ZENO',
  RYDOO: 'RYDOO',
  HAPPAY: 'HAPPAY',
  EXPENSYA: 'EXPENSYA',
  ZOHO_EXPENSE: 'ZOHO_EXPENSE',
  UNUSED_1: 'UNUSED_1',
  UNUSED_2: 'UNUSED_2',
  UNUSED_3: 'UNUSED_3',
  UNUSED_4: 'UNUSED_4',
  UNUSED_5: 'UNUSED_5',
  UNUSED_6: 'UNUSED_6',
  UNUSED_7: 'UNUSED_7',
  UNUSED_8: 'UNUSED_8',
  UNUSED_9: 'UNUSED_9',
  UNUSED_10: 'UNUSED_10',
  UNUSED_11: 'UNUSED_11',
  UNUSED_12: 'UNUSED_12',
  UNUSED_13: 'UNUSED_13',
  UNUSED_14: 'UNUSED_14',
  UNUSED_15: 'UNUSED_15',
  UNUSED_16: 'UNUSED_16',
  UNUSED_17: 'UNUSED_17',
  UNUSED_18: 'UNUSED_18',
  UNUSED_19: 'UNUSED_19',
  UNUSED_20: 'UNUSED_20',
|}> = Object.freeze({
  EXPENSIFY: 'EXPENSIFY',
  CONCUR: 'CONCUR',
  CERTIFY: 'CERTIFY',
  CHROME_RIVER: 'CHROME_RIVER',
  SERKO_ZENO: 'SERKO_ZENO',
  RYDOO: 'RYDOO',
  HAPPAY: 'HAPPAY',
  EXPENSYA: 'EXPENSYA',
  ZOHO_EXPENSE: 'ZOHO_EXPENSE',
  UNUSED_1: 'UNUSED_1',
  UNUSED_2: 'UNUSED_2',
  UNUSED_3: 'UNUSED_3',
  UNUSED_4: 'UNUSED_4',
  UNUSED_5: 'UNUSED_5',
  UNUSED_6: 'UNUSED_6',
  UNUSED_7: 'UNUSED_7',
  UNUSED_8: 'UNUSED_8',
  UNUSED_9: 'UNUSED_9',
  UNUSED_10: 'UNUSED_10',
  UNUSED_11: 'UNUSED_11',
  UNUSED_12: 'UNUSED_12',
  UNUSED_13: 'UNUSED_13',
  UNUSED_14: 'UNUSED_14',
  UNUSED_15: 'UNUSED_15',
  UNUSED_16: 'UNUSED_16',
  UNUSED_17: 'UNUSED_17',
  UNUSED_18: 'UNUSED_18',
  UNUSED_19: 'UNUSED_19',
  UNUSED_20: 'UNUSED_20',
});
export const InAppTermsAcceptedState: $ReadOnly<{|
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  ACCEPTED: 'ACCEPTED',
  NOT_ACCEPTED: 'NOT_ACCEPTED',
|}> = Object.freeze({
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  ACCEPTED: 'ACCEPTED',
  NOT_ACCEPTED: 'NOT_ACCEPTED',
});
export const Product: $ReadOnly<{|
  RIDER: 'RIDER',
  EATS: 'EATS',
  UNUSED_1: 'UNUSED_1',
  UNUSED_2: 'UNUSED_2',
  UNUSED_3: 'UNUSED_3',
  UNUSED_4: 'UNUSED_4',
  UNUSED_5: 'UNUSED_5',
  UNUSED_6: 'UNUSED_6',
  UNUSED_7: 'UNUSED_7',
  UNUSED_8: 'UNUSED_8',
  UNUSED_9: 'UNUSED_9',
  UNUSED_10: 'UNUSED_10',
  UNUSED_11: 'UNUSED_11',
  UNUSED_12: 'UNUSED_12',
  UNUSED_13: 'UNUSED_13',
  UNUSED_14: 'UNUSED_14',
  UNUSED_15: 'UNUSED_15',
  UNUSED_16: 'UNUSED_16',
  UNUSED_17: 'UNUSED_17',
  UNUSED_18: 'UNUSED_18',
  UNUSED_19: 'UNUSED_19',
  UNUSED_20: 'UNUSED_20',
|}> = Object.freeze({
  RIDER: 'RIDER',
  EATS: 'EATS',
  UNUSED_1: 'UNUSED_1',
  UNUSED_2: 'UNUSED_2',
  UNUSED_3: 'UNUSED_3',
  UNUSED_4: 'UNUSED_4',
  UNUSED_5: 'UNUSED_5',
  UNUSED_6: 'UNUSED_6',
  UNUSED_7: 'UNUSED_7',
  UNUSED_8: 'UNUSED_8',
  UNUSED_9: 'UNUSED_9',
  UNUSED_10: 'UNUSED_10',
  UNUSED_11: 'UNUSED_11',
  UNUSED_12: 'UNUSED_12',
  UNUSED_13: 'UNUSED_13',
  UNUSED_14: 'UNUSED_14',
  UNUSED_15: 'UNUSED_15',
  UNUSED_16: 'UNUSED_16',
  UNUSED_17: 'UNUSED_17',
  UNUSED_18: 'UNUSED_18',
  UNUSED_19: 'UNUSED_19',
  UNUSED_20: 'UNUSED_20',
});
export type UserProfileLogo = {|
  url: string,
  width?: ?number,
  height?: ?number,
|};
export type UserProfileTheme = {|
  color?: ?string,
  initials?: ?string,
  icon?: ?string,
  logos?: ?{
    [string]: UserProfileLogo[],
  },
|};
export type EntityProfileAttributes = {|
  billingMode?: ?$Values<typeof BillingMode>,
  name?: ?string,
  theme?: ?UserProfileTheme,
  memberUuid?: ?string,
  groupUuid?: ?string,
  isOrganizer?: ?boolean,
  version?: ?number,
  allowedExpenseProviders?: ?($Values<typeof ExpenseProvider>[]),
  allowedExpenseProvidersV2?: ?($Values<typeof ExpenseProviderV2>[]),
|};
export type BusinesssIntegrationType = string;
export const CONCUR_EXPENSE_PROVIDER: BusinesssIntegrationType = 'CONCUR';
export type BusinessIntegration = {|
  businessIntegrationType?: ?BusinesssIntegrationType,
  thirdPartyUserUuid?: ?string,
  accessToken?: ?string,
  refreshToken?: ?string,
  refreshTokenExpiry?: ?DateTime,
  businessIntegrationUpdatedAt?: ?DateTime,
  businessIntegrationDeletedAt?: ?DateTime,
|};
export type ExtraManagedBusinessAttributes = {|
  inAppTermsAccepted?: ?$Values<typeof InAppTermsAcceptedState>,
  isConvertedFromUnmanaged?: ?boolean,
|};
export type InAppLinkingAttributes = {|
  inAppTermsAccepted?: ?$Values<typeof InAppTermsAcceptedState>,
  unconfirmedEmployeeUuid?: ?UUID,
  isDecentralized?: ?boolean,
  userHadExistingUnmanaged?: ?boolean,
|};
export type ExtraProfileAttributes = {|
  extraManagedBusinessAttributes?: ?ExtraManagedBusinessAttributes,
  inAppLinkingAttributes?: ?InAppLinkingAttributes,
  businessIntegration?: ?BusinessIntegration,
|};
export type UserProfile = {|
  userProfileUuid: UUID,
  type: $Values<typeof ProfileType>,
  defaultPaymentProfileUuid?: ?UUID,
  email?: ?string,
  entityUuid?: ?UUID,
  entityProfileAttributes?: ?EntityProfileAttributes,
  isExpensingEnabled?: ?boolean,
  isVerified?: ?boolean,
  name?: ?string,
  status?: ?string,
  summaryStatementPeriods?: ?($Values<typeof SummaryPeriod>[]),
  theme?: ?UserProfileTheme,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  deletedAt?: ?DateTime,
  createdByUserUuid?: ?UUID,
  updatedByUserUuid?: ?UUID,
  activeExpenseProviders?: ?($Values<typeof ExpenseProvider>[]),
  secondaryPaymentProfileUuid?: ?UUID,
  extraProfileAttributes?: ?ExtraProfileAttributes,
  activeExpenseProvidersV2?: ?($Values<typeof ExpenseProviderV2>[]),
  defaultPaymentProfileByProduct?: ?{
    [$Values<typeof Product>]: UUID,
  },
|};
export type UserProfiles = {|
  profiles?: ?(UserProfile[]),
|};
export type UserTag = {|
  name: string,
  note?: ?string,
  notes?: ?string,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  deletedAt?: ?DateTime,
|};
export type UserRoleInfo = {|
  role?: ?$Values<typeof UserRole>,
  isSuperAdmin?: ?boolean,
  isAdmin?: ?boolean,
  isRestricted?: ?boolean,
  isBanned?: ?boolean,
|};
export type UserTrait = {|
  traitUuid: UUID,
  name: string,
  description?: ?string,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  deletedAt?: ?DateTime,
|};
export type UserTraitMap = {|
  traitUuid: UUID,
  createdAt?: ?DateTime,
  deletedAt?: ?DateTime,
|};
export type Reward = {|
  rewardType: string,
  eligibleFor?: ?string,
  enabled?: ?boolean,
  enrolled?: ?boolean,
|};
export type PaymentProfileVendorData = {|
  processorCode?: ?string,
|};
export const ComboCardInfoFunction: $ReadOnly<{|
  DEBIT: 'DEBIT',
  CREDIT: 'CREDIT',
|}> = Object.freeze({
  DEBIT: 'DEBIT',
  CREDIT: 'CREDIT',
});
export type PaymentProfileView = {|
  uuid: UUID,
  clientUuid?: ?UUID,
  cardBin?: ?string,
  cardNumber?: ?string,
  cardType?: ?string,
  cardExpiration?: ?DateTime,
  displayName?: ?string,
  billingZip?: ?string,
  billingCountryIso2?: ?string,
  label?: ?string,
  status?: ?string,
  tokenType?: ?string,
  rewards?: ?(Reward[]),
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  vendorData?: ?PaymentProfileVendorData,
  comboCardFunction?: ?$Values<typeof ComboCardInfoFunction>,
|};
export type PromotionCode = {|
  promotionCodeId: number,
  promotionCodeUuid?: ?UUID,
  promotionCode?: ?string,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
|};
export type ThirdPartyIdentity = {|
  identityType: $Values<typeof ThirdPartyIdentityType>,
  thirdPartyUserId?: ?string,
  accessToken?: ?string,
  accessTokenExpiry?: ?DateTime,
  refreshToken?: ?string,
  thirdPartyUserSecret?: ?string,
  meta?: ?string,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
|};
export type UpdateThirdPartyIdentityFields = {|
  accessToken?: ?string,
  accessTokenExpiry?: ?DateTime,
|};
export type CreateThirdPartyIdentityFields = {|
  tpi: ThirdPartyIdentity,
  accessTokenCode?: ?string,
  redirectUri?: ?string,
|};
export type GetUserByTPIAccessTokenFields = {|
  identityType: $Values<typeof ThirdPartyIdentityType>,
  accessToken?: ?string,
  accessTokenCode?: ?string,
|};
export type StatusLocks = {|
  lockFraud?: ?boolean,
  lockFraudPermanent?: ?boolean,
  lockSafety?: ?boolean,
  lockSafetyPermanent?: ?boolean,
  lockCompliance?: ?boolean,
  lockCompliancePermanent?: ?boolean,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  deletedAt?: ?DateTime,
|};
export type UpdateFraudActionsRequest = {|
  lockFraud?: ?boolean,
  lockFraudPermanent?: ?boolean,
  lockSafety?: ?boolean,
  lockSafetyPermanent?: ?boolean,
  lockCompliance?: ?boolean,
  lockCompliancePermanent?: ?boolean,
|};
export type UpdateStatusLocksRequest = {|
  lockFraud?: ?boolean,
  lockFraudPermanent?: ?boolean,
  lockSafety?: ?boolean,
  lockSafetyPermanent?: ?boolean,
  lockCompliance?: ?boolean,
  lockCompliancePermanent?: ?boolean,
|};
export type DriverEngagement = {|
  engagementCityId?: ?number,
  tier?: ?$Values<typeof EngagementTier>,
  qualifyingPoints?: ?Points,
  lifetimeRewardPoints?: ?Points,
  qualificationPeriodStartsAt?: ?DateTime,
  tierExpiresAt?: ?DateTime,
  qualificationPeriodEndsAt?: ?DateTime,
  status?: ?$Values<typeof DriverEngagementStatus>,
  isEnrolled?: ?boolean,
  enrolledAt?: ?DateTime,
|};
export type CourierEngagement = {|
  engagementCityId?: ?number,
  tier?: ?$Values<typeof EngagementTier>,
  qualifyingPoints?: ?Points,
  lifetimeRewardPoints?: ?Points,
  qualificationPeriodStartsAt?: ?DateTime,
  tierExpiresAt?: ?DateTime,
  qualificationPeriodEndsAt?: ?DateTime,
  status?: ?$Values<typeof CourierEngagementStatus>,
  isEnrolled?: ?boolean,
  enrolledAt?: ?DateTime,
|};
export type RiderEngagement = {|
  engagementCityId?: ?number,
  tier?: ?$Values<typeof EngagementTier>,
  qualifyingPoints?: ?Points,
  lifetimeRewardPoints?: ?Points,
  qualificationPeriodStartsAt?: ?DateTime,
  tierExpiresAt?: ?DateTime,
  qualificationPeriodEndsAt?: ?DateTime,
  isEnrolled?: ?boolean,
  enrolledAt?: ?DateTime,
|};
export type LoginEligibility = {|
  denyLogin?: ?boolean,
  denyLoginReason?: ?string,
|};
export type DriverInfo = {|
  contactinfo?: ?string,
  contactinfoCountryCode?: ?string,
  driverLicense?: ?string,
  firstDriverTripUuid?: ?UUID,
  iphone?: ?string,
  partnerUserUuid?: ?UUID,
  receiveSms?: ?boolean,
  twilioNumber?: ?string,
  twilioNumberFormatted?: ?string,
  cityknowledgeScore?: ?number,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  deletedAt?: ?DateTime,
  driverStatus?: ?$Values<typeof DriverStatus>,
  driverFlowType?: ?$Values<typeof DriverFlowType>,
  statusLocks?: ?StatusLocks,
  contactinfoCountryIso2Code?: ?string,
  driverEngagement?: ?DriverEngagement,
  courierEngagement?: ?CourierEngagement,
|};
export type PartnerInfo = {|
  address?: ?string,
  territoryUuid?: ?UUID,
  company?: ?string,
  address2?: ?string,
  cityId?: ?number,
  cityName?: ?string,
  firstPartnerTripUuid?: ?UUID,
  preferredCollectionPaymentProfileUuid?: ?UUID,
  phone?: ?string,
  phoneCountryCode?: ?string,
  state?: ?string,
  vatNumber?: ?string,
  zipcode?: ?string,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  deletedAt?: ?DateTime,
  fleetTypes?: ?($Values<typeof FleetType>[]),
  fleetServices?: ?($Values<typeof FleetService>[]),
  isFleet?: ?boolean,
|};
export type UserAnalytics = {|
  signupLat?: ?number,
  signupLng?: ?number,
  signupTerritoryUuid?: ?UUID,
  signupPromoId?: ?number,
  signupForm?: ?string,
  signupSessionId?: ?string,
  signupAppVersion?: ?string,
  signupAttributionMethod?: ?string,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  signupCityId?: ?number,
  signupDeviceId?: ?string,
  signupReferralId?: ?string,
  signupPromoCode?: ?string,
  signupPromoCodeUuid?: ?UUID,
  signupPromoUuid?: ?UUID,
  signupMethod?: ?$Values<typeof SignupMethod>,
|};
export type User = {|
  uuid: UUID,
  firstname?: ?string,
  lastname?: ?string,
  role?: ?$Values<typeof UserRole>,
  languageId?: ?number,
  countryId?: ?number,
  mobile?: ?string,
  mobileToken?: ?number,
  mobileCountryId?: ?number,
  mobileCountryCode?: ?string,
  hasAmbiguousMobileCountry?: ?boolean,
  lastConfirmedMobileCountryId?: ?number,
  email?: ?string,
  emailToken?: ?string,
  hasConfirmedMobile?: ?string,
  hasOptedInSmsMarketing?: ?boolean,
  hasConfirmedEmail?: ?boolean,
  gratuity?: ?number,
  nickname?: ?string,
  location?: ?string,
  banned?: ?boolean,
  cardio?: ?boolean,
  token?: ?string,
  fraudScore?: ?number,
  inviterUuid?: ?UUID,
  pictureUrl?: ?string,
  recentFareSplitterUuids?: ?(UUID[]),
  lastSelectedPaymentProfileUuid?: ?UUID,
  lastSelectedPaymentProfileGoogleWalletUuid?: ?UUID,
  inviteCode?: ?PromotionCode,
  driverInfo?: ?DriverInfo,
  partnerInfo?: ?PartnerInfo,
  analytics?: ?UserAnalytics,
  createdAt?: ?DateTime,
  updatedAt?: ?DateTime,
  deletedAt?: ?DateTime,
  tenancy?: ?string,
  mobileConfirmationStatus?: ?$Values<typeof MobileConfirmationStatus>,
  nationalId?: ?string,
  nationalIdType?: ?$Values<typeof NationalIdType>,
  merchantLocation?: ?MerchantLocation,
  lastConfirmedMobile?: ?string,
  requestedDeletionAt?: ?DateTime,
  dateOfBirth?: ?DateTime,
  userTypes?: ?($Values<typeof UserType>[]),
  preferredName?: ?string,
  freightInfo?: ?FreightInfo,
  tempPictureUrl?: ?string,
  identityVerified?: ?boolean,
  paymentEntityType?: ?string,
  riderEngagement?: ?RiderEngagement,
  identityRejectReasonUuid?: ?UUID,
  genderInferred?: ?$Values<typeof GenderType>,
  genderIdentity?: ?$Values<typeof GenderType>,
  genderDocumented?: ?$Values<typeof GenderType>,
  riderIneligibleWdw?: ?boolean,
  defaultPaymentProfileByProduct?: ?(PaymentProfileByProduct[]),
  loginEligibility?: ?LoginEligibility,
|};
export type UserWithTagNames = {|
  user?: ?User,
  tagNames?: ?(string[]),
|};
export type ExportedUser = {|
  user: User,
  canMuber?: ?boolean,
  isAdmin?: ?boolean,
  tags?: ?{
    [string]: UserTag,
  },
  paymentProfileViews?: ?(PaymentProfileView[]),
  thirdPartyIdentities?: ?(ThirdPartyIdentity[]),
  notes?: ?(UserNote[]),
  traits?: ?{
    [string]: UserTraitMap,
  },
  alternateEmails?: ?{
    [string]: UserEmail,
  },
|};
export type DerivedFields = {|
  hasConfirmedMobileStatus?: ?string,
  isExemptedFromConfirmingMobile?: ?boolean,
  isMobileExempt?: ?boolean,
  mobileLocal?: ?string,
  languageCode?: ?string,
  driverContactInfoFormatted?: ?string,
  riderReferralUrl?: ?string,
  driverReferralUrl?: ?string,
|};
export type ExtendedDerivedFields = {|
  clientClaimedMobileLocal?: ?string,
  driverType?: ?string,
  partnerStatus?: ?string,
  baseName?: ?string,
|};
export type FareSplitterInfo = {|
  firstname?: ?string,
  lastname?: ?string,
  mobile?: ?string,
  mobileCountryIso2?: ?string,
  pictureUrl?: ?string,
|};
export type CompleteUser = {|
  user?: ?User,
  userTags?: ?{
    [string]: UserTag,
  },
  userAttributes?: ?{
    [string]: UserAttribute,
  },
  thirdPartyIdentities?: ?(ThirdPartyIdentity[]),
  hasConfirmedMobileStatus?: ?string,
  isExemptedFromConfirmingMobile?: ?boolean,
  isMobileExempt?: ?boolean,
  mobileLocal?: ?string,
  languageCode?: ?string,
  driverContactInfoFormatted?: ?string,
  riderReferralUrl?: ?string,
  driverReferralUrl?: ?string,
  clientClaimedMobileLocal?: ?string,
  driverType?: ?string,
  partnerStatus?: ?string,
  baseName?: ?string,
  countryIso2Code?: ?string,
  formattedAddress?: ?(string[]),
  paymentProfileViews?: ?(PaymentProfileView[]),
  mobileCountryIso2Code?: ?string,
  userTraits?: ?{
    [UUID]: UserTraitMap,
  },
  hasValidPaymentProfile?: ?boolean,
  lastConfirmedMobileCountryCode?: ?string,
  lastConfirmedMobileCountryIso2Code?: ?string,
  driverContactInfoCountryIso2Code?: ?string,
|};
export type ExtendedUser = {|
  user?: ?User,
  userTags?: ?{
    [string]: UserTag,
  },
  userAttributes?: ?{
    [string]: UserAttribute,
  },
  thirdPartyIdentities?: ?(ThirdPartyIdentity[]),
  hasConfirmedMobileStatus?: ?string,
  isExemptedFromConfirmingMobile?: ?boolean,
  isMobileExempt?: ?boolean,
  mobileLocal?: ?string,
  languageCode?: ?string,
  driverContactInfoFormatted?: ?string,
  riderReferralUrl?: ?string,
  driverReferralUrl?: ?string,
  clientClaimedMobileLocal?: ?string,
  driverType?: ?string,
  partnerStatus?: ?string,
  baseName?: ?string,
  fullPictureUrl?: ?string,
  countryIso2Code?: ?string,
  formattedAddress?: ?(string[]),
  paymentProfileViews?: ?(PaymentProfileView[]),
  mobileCountryIso2Code?: ?string,
  userTraits?: ?{
    [UUID]: UserTraitMap,
  },
  recentFareSplitters?: ?(FareSplitterInfo[]),
  hasValidPaymentProfile?: ?boolean,
  lastConfirmedMobileCountryCode?: ?string,
  lastConfirmedMobileCountryIso2Code?: ?string,
  cityId?: ?number,
|};
export type UserSegment = {|
  name: string,
  version?: ?number,
  createdByUserUuid?: ?UUID,
  createdByService?: ?string,
  createdAt?: ?DateTime,
  updatedByUserUuid?: ?UUID,
  updatedByService?: ?string,
  updatedAt?: ?DateTime,
  deletedByUserUuid?: ?UUID,
  deletedByService?: ?string,
  deletedAt?: ?DateTime,
|};
export type RequestedFields = {|
  user?: ?boolean,
  userTags?: ?boolean,
  userAttributes?: ?boolean,
  thirdPartyIdentities?: ?boolean,
  hasConfirmedMobileStatus?: ?boolean,
  isExemptedFromConfirmingMobile?: ?boolean,
  isMobileExempt?: ?boolean,
  mobileLocal?: ?boolean,
  languageCode?: ?boolean,
  driverContactInfoFormatted?: ?boolean,
  riderReferralUrl?: ?boolean,
  driverReferralUrl?: ?boolean,
  clientClaimedMobileLocal?: ?boolean,
  driverType?: ?boolean,
  partnerStatus?: ?boolean,
  baseName?: ?boolean,
  fullPictureUrl?: ?boolean,
  countryIso2Code?: ?boolean,
  formattedAddress?: ?boolean,
  paymentProfileViews?: ?boolean,
  mobileCountryIso2Code?: ?boolean,
  userTraits?: ?boolean,
  recentFareSplitters?: ?boolean,
  hasValidPaymentProfile?: ?boolean,
  lastConfirmedMobileCountryCode?: ?boolean,
  lastConfirmedMobileCountryIso2Code?: ?boolean,
  cityId?: ?boolean,
|};
export const SignupMethod: $ReadOnly<{|
  REGULAR: 'REGULAR',
  MOBILE_ONLY: 'MOBILE_ONLY',
  PASSWORDLESS: 'PASSWORDLESS',
|}> = Object.freeze({
  REGULAR: 'REGULAR',
  MOBILE_ONLY: 'MOBILE_ONLY',
  PASSWORDLESS: 'PASSWORDLESS',
});
export const MobileConfirmationStatus: $ReadOnly<{|
  MOBILE_CONFIRMED: 'MOBILE_CONFIRMED',
  MOBILE_SMS_CONFIRMED: 'MOBILE_SMS_CONFIRMED',
  MOBILE_VOICE_CONFIRMED: 'MOBILE_VOICE_CONFIRMED',
  MOBILE_VOICE_CONFIRM_REQUIRED: 'MOBILE_VOICE_CONFIRM_REQUIRED',
  MOBILE_NOT_CONFIRMED: 'MOBILE_NOT_CONFIRMED',
  MOBILE_EXEMPT: 'MOBILE_EXEMPT',
  MOBILE_EXEMPT_NON_AMERICAN: 'MOBILE_EXEMPT_NON_AMERICAN',
  MOBILE_EXEMPT_GLOBAL: 'MOBILE_EXEMPT_GLOBAL',
|}> = Object.freeze({
  MOBILE_CONFIRMED: 'MOBILE_CONFIRMED',
  MOBILE_SMS_CONFIRMED: 'MOBILE_SMS_CONFIRMED',
  MOBILE_VOICE_CONFIRMED: 'MOBILE_VOICE_CONFIRMED',
  MOBILE_VOICE_CONFIRM_REQUIRED: 'MOBILE_VOICE_CONFIRM_REQUIRED',
  MOBILE_NOT_CONFIRMED: 'MOBILE_NOT_CONFIRMED',
  MOBILE_EXEMPT: 'MOBILE_EXEMPT',
  MOBILE_EXEMPT_NON_AMERICAN: 'MOBILE_EXEMPT_NON_AMERICAN',
  MOBILE_EXEMPT_GLOBAL: 'MOBILE_EXEMPT_GLOBAL',
});
export type SearchPagingInfo = {|
  token?: ?string,
  limit?: ?number,
  forceNoSorting?: ?boolean,
  limit32?: ?number,
|};
export type PagingResult = {|
  nextPageToken?: ?string,
  estimatedTotalPages?: ?number,
|};
export type UserPicture = {|
  base64EncodeString?: ?string,
  existingPictureName?: ?string,
|};
export type PartnerDriversPagingResult = {|
  drivers: User[],
  paging?: ?PagingResult,
|};
export type SetClientMobileConfirmationStatusRequest = {|
  status: $Values<typeof MobileConfirmationStatus>,
  mobile?: ?string,
  mobileCountryId?: ?number,
  mobileCountryCode?: ?string,
  shouldConsolidateDriverMobile?: ?boolean,
|};
export type ReleaseMobileNumberRequest = {|
  nationalNumber?: ?string,
  countryCode?: ?string,
|};
export type ChangeRoleRequest = {|
  newRole?: ?$Values<typeof UserRole>,
  driverInfo?: ?DriverInfo,
  partnerInfo?: ?PartnerInfo,
  freightInfo?: ?FreightInfo,
|};
export const UserDataType: $ReadOnly<{|
  PROFILE_PHOTO: 'PROFILE_PHOTO',
  MOBILE: 'MOBILE',
  USER_NAMES: 'USER_NAMES',
  UNUSED_TYPE3: 'UNUSED_TYPE3',
  UNUSED_TYPE4: 'UNUSED_TYPE4',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
|}> = Object.freeze({
  PROFILE_PHOTO: 'PROFILE_PHOTO',
  MOBILE: 'MOBILE',
  USER_NAMES: 'USER_NAMES',
  UNUSED_TYPE3: 'UNUSED_TYPE3',
  UNUSED_TYPE4: 'UNUSED_TYPE4',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
});
export type UserDataHistoryElement = {|
  value?: ?string,
  oldValue?: ?string,
  userDataType?: ?$Values<typeof UserDataType>,
  userActivityType?: ?string,
  requester?: ?string,
  source?: ?string,
  updatedAt?: ?DateTime,
|};
export type GetUserDataHistoryRequest = {|
  userDataType?: ?$Values<typeof UserDataType>,
  userActivityType?: ?string,
  pageSize?: ?number,
  token?: ?string,
|};
export type GetUserDataHistoryResponse = {|
  userDataHistory?: ?(UserDataHistoryElement[]),
  token?: ?string,
|};
export type GetUserSegmentRequest = {|
  userUUID: UUID,
  domain: string,
|};
export type UpdateUserSegmentRequest = {|
  userUUID: UUID,
  domain: string,
  name: string,
  version?: ?number,
  ignoreIfExist?: ?boolean,
|};
export type Headers = {|
  acceptLanguage?: ?string,
  xUberDeviceLanguage?: ?string,
  xUberDeviceLocationLatitude?: ?number,
  xUberDeviceLocationLongitude?: ?number,
  xForwardedFor?: ?string,
|};
export type CreateBaseUserRequest = {|
  tenancy?: ?string,
  email?: ?string,
  hasConfirmedEmail?: ?boolean,
  mobile?: ?string,
  mobileCountryCode?: ?string,
  mobileConfirmationStatus?: ?$Values<typeof MobileConfirmationStatus>,
  headers?: ?Headers,
|};
export const EngagementTier: $ReadOnly<{|
  UNKNOWN: 'UNKNOWN',
  TIER_1: 'TIER_1',
  TIER_2: 'TIER_2',
  TIER_3: 'TIER_3',
  TIER_4: 'TIER_4',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
|}> = Object.freeze({
  UNKNOWN: 'UNKNOWN',
  TIER_1: 'TIER_1',
  TIER_2: 'TIER_2',
  TIER_3: 'TIER_3',
  TIER_4: 'TIER_4',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
});
export const DriverEngagementStatus: $ReadOnly<{|
  NONE: 'NONE',
  WARNING_QUALITY: 'WARNING_QUALITY',
  SUSPENDED_QUALITY: 'SUSPENDED_QUALITY',
  UNUSED_TYPE3: 'UNUSED_TYPE3',
  UNUSED_TYPE4: 'UNUSED_TYPE4',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
|}> = Object.freeze({
  NONE: 'NONE',
  WARNING_QUALITY: 'WARNING_QUALITY',
  SUSPENDED_QUALITY: 'SUSPENDED_QUALITY',
  UNUSED_TYPE3: 'UNUSED_TYPE3',
  UNUSED_TYPE4: 'UNUSED_TYPE4',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
});
export const CourierEngagementStatus: $ReadOnly<{|
  NONE: 'NONE',
  WARNING_QUALITY: 'WARNING_QUALITY',
  SUSPENDED_QUALITY: 'SUSPENDED_QUALITY',
  UNUSED_TYPE3: 'UNUSED_TYPE3',
  UNUSED_TYPE4: 'UNUSED_TYPE4',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
|}> = Object.freeze({
  NONE: 'NONE',
  WARNING_QUALITY: 'WARNING_QUALITY',
  SUSPENDED_QUALITY: 'SUSPENDED_QUALITY',
  UNUSED_TYPE3: 'UNUSED_TYPE3',
  UNUSED_TYPE4: 'UNUSED_TYPE4',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
});
export const GenderType: $ReadOnly<{|
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  INDETERMINATE: 'INDETERMINATE',
  OTHER: 'OTHER',
  DECLINED: 'DECLINED',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
|}> = Object.freeze({
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  INDETERMINATE: 'INDETERMINATE',
  OTHER: 'OTHER',
  DECLINED: 'DECLINED',
  UNUSED_TYPE5: 'UNUSED_TYPE5',
  UNUSED_TYPE6: 'UNUSED_TYPE6',
  UNUSED_TYPE7: 'UNUSED_TYPE7',
  UNUSED_TYPE8: 'UNUSED_TYPE8',
  UNUSED_TYPE9: 'UNUSED_TYPE9',
  UNUSED_TYPE10: 'UNUSED_TYPE10',
});
export type RiderEngagementRequest = {|
  userUuid?: ?UUID,
  engagement?: ?RiderEngagement,
|};
export type DriverEngagementRequest = {|
  userUuid?: ?UUID,
  engagement?: ?DriverEngagement,
|};
export type CourierEngagementRequest = {|
  userUuid?: ?UUID,
  engagement?: ?CourierEngagement,
|};
export type ChangeUserCityAndFlowTypeRequest = {|
  userUuid?: ?UUID,
  territoryId?: ?number,
  flowType?: ?$Values<typeof DriverFlowType>,
|};
export type ChangeUserCityAndFlowTypeResponse = {|
  message?: ?string,
  success?: ?boolean,
  type?: ?string,
|};
export type UpdateLoginEligibilityRequest = {|
  denyLogin?: ?boolean,
  denyLoginReason?: ?string,
|};
export type UserService = {
  createUserTag: (
    args: {|
      userUuid: UUID,
      name: string,
      note: string,
      notes: string[],
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserTag>,
  deleteUserTag: (
    args: {|
      userUuid: UUID,
      tagName: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  updateUserTagBulk: (
    args: {|
      userUuids: UUID[],
      name: string,
      note: string,
      notes: string[],
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  addUserTrait: (
    args: {|
      userUuid: UUID,
      traitUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserTraitMap>,
  removeUserTrait: (
    args: {|
      userUuid: UUID,
      traitUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  getUserTraits: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserTraitMap[]>,
  createUser: (
    args: {|
      user: User,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  assignUserTypes: (
    args: {|
      userUuid: UUID,
      userTypes: $Values<typeof UserType>[],
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  removeUserTypes: (
    args: {|
      userUuid: UUID,
      userTypes: $Values<typeof UserType>[],
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  updateUserInfo: (
    args: {|
      userUuid: UUID,
      userFields: UpdateUserInfoRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  updateDriverInfo: (
    args: {|
      userUuid: UUID,
      userFields: UpdateUserInfoRequest,
      driverFields: UpdateDriverInfoRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  updatePartnerInfo: (
    args: {|
      userUuid: UUID,
      userFields: UpdateUserInfoRequest,
      driverFields: UpdateDriverInfoRequest,
      partnerFields: UpdatePartnerInfoRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  updateFreightInfo: (
    args: {|
      userUuid: UUID,
      freightFields: UpdateFreightInfoRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  deleteUser: (
    args: {|
      userUuid: UUID,
      note: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  markUserForDeletion: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  unmarkUserForDeletion: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  scrubUser: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  deleteUserTestTenancy: (
    args: {|
      userUuid: UUID,
      note: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  updateUserPicture: (
    args: {|
      userUuid: UUID,
      userPicture: UserPicture,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  deleteUserPicture: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  deleteDriverContactInfo: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  setAlternateEmails: (
    args: {|
      userUuid: UUID,
      emails: UserEmail[],
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  setConfirmAlternateEmail: (
    args: {|
      userUuid: UUID,
      email: string,
      isConfirmed: boolean,
      emailToken: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  setConfirmEmail: (
    args: {|
      userUuid: UUID,
      emailToken: string,
      isConfirmed: boolean,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  setToken: (
    args: {|
      userUuid: UUID,
      token: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  setEmailToken: (
    args: {|
      userUuid: UUID,
      emailToken: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  createUserNote: (
    args: {|
      userUuid: UUID,
      note: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserNote>,
  deleteUserNote: (
    args: {|
      userUuid: UUID,
      noteId: number,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  updateUserAttribute: (
    args: {|
      userUuid: UUID,
      key: string,
      value: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserAttribute>,
  deleteUserAttribute: (
    args: {|
      userUuid: UUID,
      key: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  setPaymentProfileViews: (
    args: {|
      userUuid: UUID,
      paymentProfileViews: PaymentProfileView[],
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  deletePaymentProfileView: (
    args: {|
      userUuid: UUID,
      paymentProfileUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  createThirdPartyIdentity: (
    args: {|
      userUuid: UUID,
      tpiFields: CreateThirdPartyIdentityFields,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<ThirdPartyIdentity>,
  updateThirdPartyIdentity: (
    args: {|
      userUuid: UUID,
      identityFields: UpdateThirdPartyIdentityFields,
      identityType: $Values<typeof ThirdPartyIdentityType>,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<ThirdPartyIdentity>,
  deleteThirdPartyIdentity: (
    args: {|
      userUuid: UUID,
      identityType: $Values<typeof ThirdPartyIdentityType>,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  createTraitType: (
    args: {|
      traitUuid: UUID,
      name: string,
      description: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  deleteTraitType: (
    args: {|
      traitUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  unbanUser: (
    args: {|
      userUuid: UUID,
      additionalTag: string,
      note: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  banUser: (
    args: {|
      userUuid: UUID,
      additionalTag: string,
      note: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  reinstateRole: (
    args: {|
      userUuid: UUID,
      newRole: $Values<typeof UserRole>,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  changeRole: (
    args: {|
      userUuid: UUID,
      changeRoleRequest: ChangeRoleRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  changeDriversPartner: (
    args: {|
      driverUuid: UUID,
      partnerUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  forceTokenAndEmailTokenReset: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  getUser: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  getCompleteUser: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<CompleteUser>,
  getUsers: (
    args: {|
      userUuids: UUID[],
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User[]>,
  getUserWithTagNames: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserWithTagNames>,
  getDerivedFields: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<DerivedFields>,
  getExtendedDerivedFields: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<ExtendedDerivedFields>,
  getExtendedUser: (
    args: {|
      userUuid: UUID,
      requestedFields: RequestedFields,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<ExtendedUser>,
  getFullPictureUrl: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<string>,
  getUserByToken: (
    args: {|
      token: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  getUserByEmail: (
    args: {|
      email: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  getUserByPromotionCode: (
    args: {|
      promotionCode: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  getUserByFullMobile: (
    args: {|
      mobile: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  getUserByMobileAndCountryCode: (
    args: {|
      nationalNumber: string,
      countryCode: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  getUserByTwilioNumber: (
    args: {|
      twilioNumber: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  getUserByNickname: (
    args: {|
      nickname: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  getUserByThirdPartyIdentity: (
    args: {|
      identityType: $Values<typeof ThirdPartyIdentityType>,
      thirdPartyUserId: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  getUserByTPIAccessToken: (
    args: {|
      fields: GetUserByTPIAccessTokenFields,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  getUserByEmailToken: (
    args: {|
      emailToken: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  getAlternateEmails: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserEmail[]>,
  getAddressesByType: (
    args: {|
      userUuid: UUID,
      addressType: $Values<typeof AddressType>,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<{
    [UUID]: Address,
  }>,
  getAddresses: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<{
    [UUID]: Address,
  }>,
  createAddress: (
    args: {|
      userUuid: UUID,
      addressInfo: AddressInfo,
      addressType: $Values<typeof AddressType>,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<Address>,
  updateAddress: (
    args: {|
      userUuid: UUID,
      addressUuid: UUID,
      addressInfo: AddressInfo,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<Address>,
  deleteAddress: (
    args: {|
      userUuid: UUID,
      addressUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  getUserAttributes: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<{
    [string]: UserAttribute,
  }>,
  getUserAttributeByKey: (
    args: {|
      userUuid: UUID,
      key: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserAttribute>,
  getUserAttributeByKeys: (
    args: {|
      userUuid: UUID,
      keys: string[],
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<{
    [string]: UserAttribute,
  }>,
  getUserNotes: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserNote[]>,
  getUserTags: (
    args: {|
      userUuid: UUID,
      activeOnly: boolean,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<{
    [string]: UserTag,
  }>,
  getUserTag: (
    args: {|
      userUuid: UUID,
      tag: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserTag>,
  hasUserTags: (
    args: {|
      userUuid: UUID,
      names: string[],
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<string[]>,
  getUserRoleInfo: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserRoleInfo>,
  getUserTenancy: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<string>,
  getPartnerDrivers: (
    args: {|
      partnerUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User[]>,
  getPartnerDriversPagingResult: (
    args: {|
      partnerUuid: UUID,
      pagingInfo: SearchPagingInfo,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<PartnerDriversPagingResult>,
  getDriversByContactInfo: (
    args: {|
      nationalNumber: string,
      countryCode: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User[]>,
  getThirdPartyIdentities: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<ThirdPartyIdentity[]>,
  refreshThirdPartyIdentityToken: (
    args: {|
      userUuid: UUID,
      identityType: $Values<typeof ThirdPartyIdentityType>,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<ThirdPartyIdentity>,
  getPaymentProfileViews: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<PaymentProfileView[]>,
  getAllTraitTypes: (
    args: {},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<{
    [UUID]: UserTrait,
  }>,
  getAppRevokedTime: (
    args: {|
      userUuid: UUID,
      oauthAppId: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<DateTime>,
  setAppRevoked: (
    args: {|
      userUuid: UUID,
      oauthAppId: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  createUserProfile: (
    args: {|
      userUuid: UUID,
      userProfile: UserProfile,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserProfile>,
  getUserProfiles: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserProfile[]>,
  getUserProfilesWithDeletedProfiles: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserProfile[]>,
  updateUserProfile: (
    args: {|
      userUuid: UUID,
      userProfile: UserProfile,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserProfile>,
  deleteUserProfile: (
    args: {|
      userUuid: UUID,
      profileUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  getDriverStatuses: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<DriverStatusEntity[]>,
  updateDriverStatusWithEntity: (
    args: {|
      userUuid: UUID,
      updateDriverStatusRequest: UpdateDriverStatusRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  setDriverFlowType: (
    args: {|
      driverUuid: UUID,
      driverFlowType: $Values<typeof DriverFlowType>,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  setMobileConfirmationStatus: (
    args: {|
      userUuid: UUID,
      status: $Values<typeof MobileConfirmationStatus>,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  setClientMobileConfirmationStatus: (
    args: {|
      userUuid: UUID,
      setClientMobileConfirmationStatusRequest: SetClientMobileConfirmationStatusRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  setMobileToken: (
    args: {|
      userUuid: UUID,
      mobileToken: number,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  setReferralCode: (
    args: {|
      userUuid: UUID,
      referralCode: string,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  setInviterUuid: (
    args: {|
      userUuid: UUID,
      inviterUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  updateNationalId: (
    args: {|
      userUuid: UUID,
      request: UpdateNationalIdRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  setFirstDriverTripUuid: (
    args: {|
      userUuid: UUID,
      firstTripUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  setFirstPartnerTripUuid: (
    args: {|
      userUuid: UUID,
      firstTripUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  setRecentFareSplitterUuids: (
    args: {|
      userUuid: UUID,
      recentFareSplitterUuids: UUID[],
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  getUserDataHistory: (
    args: {|
      userUuid: UUID,
      request: GetUserDataHistoryRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<GetUserDataHistoryResponse>,
  getUserSegment: (
    args: {|
      request: GetUserSegmentRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UserSegment>,
  updateUserSegment: (
    args: {|
      request: UpdateUserSegmentRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  createMarketingAttributedEvent: (
    args: {|
      userUuid: UUID,
      marketingAttributedEvent: MarketingAttributedEvent,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<MarketingAttributedEvent>,
  getMarketingAttributedEvents: (
    args: {|
      userUuid: UUID,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<MarketingAttributedEvent[]>,
  updateMarketingAttributedEvent: (
    args: {|
      request: UpdateMarketingAttributedEventRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  deleteMarketingAttributedEvent: (
    args: {|
      userUuid: UUID,
      selector: MarketingAttributedEventSelector,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  createBaseUser: (
    args: {|
      request: CreateBaseUserRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  updateFraudActions: (
    args: {|
      userUuid: UUID,
      fraudActions: UpdateFraudActionsRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  updateStatusLocks: (
    args: {|
      userUuid: UUID,
      statusLocks: UpdateStatusLocksRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
  releaseMobileNumber: (
    args: {|
      releaseMobileNumberRequest: ReleaseMobileNumberRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<UUID>,
  updateRiderEngagement: (
    args: {|
      riderEngagementRequest: RiderEngagementRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  updateDriverEngagement: (
    args: {|
      driverEngagementRequest: DriverEngagementRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  updateCourierEngagement: (
    args: {|
      courierEngagementRequest: CourierEngagementRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<void>,
  changeUserCityAndFlowType: (
    args: {|
      changeUserCityAndFlowTypeRequest: ChangeUserCityAndFlowTypeRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<ChangeUserCityAndFlowTypeResponse[]>,
  updateLoginEligibility: (
    args: {|
      userUuid: UUID,
      updateLoginEligibilityRequest: UpdateLoginEligibilityRequest,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<User>,
};
export type HealthStatus = {|
  ok: boolean,
  message?: ?string,
|};
export type FlameOptions = {|
  durationSeconds: number,
  endpoint?: ?string,
  minLatencyMS?: ?number,
  maxLatencyMS?: ?number,
|};
export type Meta = {
  health: (
    args: {},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<HealthStatus>,
  thriftIDL: (
    args: {},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<string>,
  profile: (
    args: {|
      seconds: number,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<string>,
  flame: (
    args: {|
      options: FlameOptions,
    |},
    context: FusionContext,
    info: GraphQLResolveInfo,
    options: ?OptionsType
  ) => Promise<string>,
};
