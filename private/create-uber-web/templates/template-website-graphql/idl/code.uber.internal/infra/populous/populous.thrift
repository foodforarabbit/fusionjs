namespace java com.uber.populous

typedef string UUID

/** Milliseconds from Epoch */
typedef i64 DateTime
typedef i64 (js.type = "Long") Points

enum NationalIdType
{
  SPANISH_ID_OR_PASSPORT = 1,
}

enum UnauthorizedReason
{
  PERMISSION_DENIED = 1,
  INSUFFICIENT_PRIVILEGE,
  USER_BANNED,
  INVALID_UUID,
  SERVICE_NOT_WHITELISTED,
  MOBILE_IN_USE,
}

/** Address Type */
enum AddressType
{
  PARTNER_INPUT_ADDRESS = 1,
}

/** User Type */
enum UserType
{
  FLEET = 1,
  FREIGHT_CARRIER = 2,
  FREIGHT_DRIVER = 3,
  FREIGHT_FACTORING_COMPANY = 4,
  UNUSED_5 = 5,
  UNUSED_6 = 6,
  UNUSED_7 = 7,
  UNUSED_8 = 8,
  UNUSED_9 = 9,
  UNUSED_10 = 10,
  UNUSED_11 = 11,
  UNUSED_12 = 12,
  UNUSED_13 = 13,
  UNUSED_14 = 14,
  UNUSED_15 = 15,
  UNUSED_16 = 16,
  UNUSED_17 = 17,
  UNUSED_18 = 18,
  UNUSED_19 = 19,
  UNUSED_20 = 20,
  UNUSED_21 = 21,
  UNUSED_22 = 22,
  UNUSED_23 = 23,
  UNUSED_24 = 24,
  UNUSED_25 = 25,
  UNUSED_26 = 26,
  UNUSED_27 = 27,
  UNUSED_28 = 28,
  UNUSED_29 = 29,
  UNUSED_30 = 30,
  UNUSED_31 = 31,
  UNUSED_32 = 32,
}

/** Driver compensation type */
enum DriverCompensationType
{
  HOURLY=1,
  COMMISSION=2,
}

/** Partner status from partner_status_tag */
enum PartnerStatus
{
 APPLIED = 1,
 ACTIVE = 2,
 REJECTED = 3,
 INACTIVE = 4,
}

/** Exceptions */
exception EntityAlreadyExists
{
  1: optional string message;
  2: optional UUID existingUuid;
}

exception EntityNotFound
{
  1: optional string message;
}

exception Unauthorized
{
  1: optional string message;
  2: optional UnauthorizedReason reason;
}

exception IndexingError
{
  1: optional string message;
}

exception AuthenticationError
{
    1: optional string message;
}

exception RateLimitedError
{
    1: optional string message;
}

/** An array of validation error messages
 indexed by a validation entity name */
exception ValidationError
{
  1: optional map<string, string> messages;
}

/**
 Client to driver, driver to partner
 role change errors */
exception UserMissingArgument
{
  1: optional string message;
}

exception UserDataConstraintClientException
{
  1: optional string message;
}

exception ThirdPartyAPIError
{
  1: optional string message
}

exception AccountMissingMobileNumber
{
}

/** Internal server error. Client gets this exception for
 any uncaught exception in request serving */
exception InternalServerError
{
  1: optional string message;
}

enum UserRole
{
  CLIENT = 1,
  DRIVER,
  PARTNER,
  MERCHANT
}

enum DriverStatus
{
  ACTIVE = 1,
  PENDING_ONBOARDING,
  READY_TO_ONBOARDING,
  ACCEPTED,
  INTERVIEWED,
  PENDING_INTERVIEW,
  READY_TO_INTERVIEW,
  APPLIED,
  WAITLISTED,
  REJECTED,
  WAITLISTED_FOR_MISSING_DOCS,
  WAITLISTED_AUTO_REACTIVATION
}

enum DriverFlowType
{
  BLACK = 1,
  TAXI = 2,
  P2P = 3,
  OTHER = 4,
  SUBURBS = 5,
  UBERX = 6,
  REMOTE = 7,
  SUV = 40,
  LOGISTICS = 41,
  UBER_EATS = 141,
  COMMUTE = 142,
  MOTORBIKE = 143,
  ONBOARDER = 144,
  TEMPORARY = 209,
  ATC = 1000,
  UBERFREIGHT = 1001,
  FLEET = 1002,
  FLEETOPERATOR = 1003,
  UBER_LITE = 1004,
  HOURLY_RENTALS = 1005,
  NEMOEARNER = 1006,
  UNUSED_6 = 1007,
  UNUSED_7 = 1008,
  UNUSED_8 = 1009,
  UNUSED_9 = 1010,
  UNUSED_10 = 1011,
  UNUSED_11 = 1012,
  UNUSED_12 = 1013,
  UNUSED_13 = 1014,
  UNUSED_14 = 1015,
  UNUSED_15 = 1016,
  UNUSED_16 = 1017,
  UNUSED_17 = 1018,
  UNUSED_18 = 1019,
  UNUSED_19 = 1020,
  UNUSED_20 = 1021,
  UNUSED_21 = 1022,
  UNUSED_22 = 1023,
  UNUSED_23 = 1024,
  UNUSED_24 = 1025,
  UNUSED_25 = 1026,
  UNUSED_26 = 1027,
  UNUSED_27 = 1028,
  UNUSED_28 = 1029,
  UNUSED_29 = 1030,
  UNUSED_30 = 1031,
  UNUSED_31 = 1032,
  UNUSED_32 = 1033,
  UNUSED_33 = 1034,
  UNUSED_34 = 1035,
  UNUSED_35 = 1036,
  UNUSED_36 = 1037,
  UNUSED_37 = 1038,
  UNUSED_38 = 1039,
  UNUSED_39 = 1040,
  UNUSED_40 = 1041,
  UNUSED_41 = 1042,
  UNUSED_42 = 1043,
  UNUSED_43 = 1044,
  UNUSED_44 = 1045,
  UNUSED_45 = 1046,
  UNUSED_46 = 1047,
  UNUSED_47 = 1048,
  UNUSED_48 = 1049,
  UNUSED_49 = 1050,
  UNUSED_50 = 1051,
  UNUSED_51 = 1052,
  UNUSED_52 = 1053,
  UNUSED_53 = 1054,
  UNUSED_54 = 1055,
  UNUSED_55 = 1056,
  UNUSED_56 = 1057,
  UNUSED_57 = 1058,
  UNUSED_58 = 1059,
  UNUSED_59 = 1060,
  UNUSED_60 = 1061,
  UNUSED_61 = 1062,
  UNUSED_62 = 1063,
  UNUSED_63 = 1064,
  UNUSED_64 = 1065,
  UNUSED_65 = 1066,
  UNUSED_66 = 1067,
  UNUSED_67 = 1068,
  UNUSED_68 = 1069,
  UNUSED_69 = 1070,
  UNUSED_70 = 1071,
  UNUSED_71 = 1072,
  UNUSED_72 = 1073,
  UNUSED_73 = 1074,
  UNUSED_74 = 1075,
  UNUSED_75 = 1076,
  UNUSED_76 = 1077,
  UNUSED_77 = 1078,
  UNUSED_78 = 1079,
  UNUSED_79 = 1080,
  UNUSED_80 = 1081,
  UNUSED_81 = 1082,
  UNUSED_82 = 1083,
  UNUSED_83 = 1084,
  UNUSED_84 = 1085,
  UNUSED_85 = 1086,
  UNUSED_86 = 1087,
  UNUSED_87 = 1088,
  UNUSED_88 = 1089,
  UNUSED_89 = 1090,
  UNUSED_90 = 1091,
  UNUSED_91 = 1092,
  UNUSED_92 = 1093,
  UNUSED_93 = 1094,
  UNUSED_94 = 1095,
  UNUSED_95 = 1096,
  UNUSED_96 = 1097,
  UNUSED_97 = 1098,
  UNUSED_98 = 1099,
  UNUSED_99 = 1100,
  UNUSED_100 = 1101,
  UNUSED_101 = 1102,
  UNUSED_102 = 1103,
  UNUSED_103 = 1104,
  UNUSED_104 = 1105,
  UNUSED_105 = 1106,
  UNUSED_106 = 1107,
  UNUSED_107 = 1108,
  UNUSED_108 = 1109,
  UNUSED_109 = 1110,
  UNUSED_110 = 1111,
  UNUSED_111 = 1112,
  UNUSED_112 = 1113,
  UNUSED_113 = 1114,
  UNUSED_114 = 1115,
  UNUSED_115 = 1116,
  UNUSED_116 = 1117,
  UNUSED_117 = 1118,
  UNUSED_118 = 1119,
  UNUSED_119 = 1120,
  UNUSED_120 = 1121,
  UNUSED_121 = 1122,
  UNUSED_122 = 1123,
  UNUSED_123 = 1124,
  UNUSED_124 = 1125,
  UNUSED_125 = 1126,
  UNUSED_126 = 1127,
  UNUSED_127 = 1128,
  UNUSED_128 = 1129,
  UNUSED_129 = 1130,
  UNUSED_130 = 1131,
  UNUSED_131 = 1132,
  UNUSED_132 = 1133,
  UNUSED_133 = 1134,
  UNUSED_134 = 1135,
  UNUSED_135 = 1136,
  UNUSED_136 = 1137,
  UNUSED_137 = 1138,
  UNUSED_138 = 1139,
  UNUSED_139 = 1140,
  UNUSED_140 = 1141,
  UNUSED_141 = 1142,
  UNUSED_142 = 1143,
  UNUSED_143 = 1144,
  UNUSED_144 = 1145,
  UNUSED_145 = 1146,
  UNUSED_146 = 1147,
  UNUSED_147 = 1148,
  UNUSED_148 = 1149,
  UNUSED_149 = 1150,
  UNUSED_150 = 1151,
  UNUSED_151 = 1152,
  UNUSED_152 = 1153,
  UNUSED_153 = 1154,
  UNUSED_154 = 1155,
  UNUSED_155 = 1156,
  UNUSED_156 = 1157,
  UNUSED_157 = 1158,
  UNUSED_158 = 1159,
  UNUSED_159 = 1160,
  UNUSED_160 = 1161,
  UNUSED_161 = 1162,
  UNUSED_162 = 1163,
  UNUSED_163 = 1164,
  UNUSED_164 = 1165,
  UNUSED_165 = 1166,
  UNUSED_166 = 1167,
  UNUSED_167 = 1168,
  UNUSED_168 = 1169,
  UNUSED_169 = 1170,
  UNUSED_170 = 1171,
  UNUSED_171 = 1172,
  UNUSED_172 = 1173,
  UNUSED_173 = 1174,
  UNUSED_174 = 1175,
  UNUSED_175 = 1176,
  UNUSED_176 = 1177,
  UNUSED_177 = 1178,
  UNUSED_178 = 1179,
  UNUSED_179 = 1180,
  UNUSED_180 = 1181,
  UNUSED_181 = 1182,
  UNUSED_182 = 1183,
  UNUSED_183 = 1184,
  UNUSED_184 = 1185,
  UNUSED_185 = 1186,
  UNUSED_186 = 1187,
  UNUSED_187 = 1188,
  UNUSED_188 = 1189,
  UNUSED_189 = 1190,
  UNUSED_190 = 1191,
  UNUSED_191 = 1192,
  UNUSED_192 = 1193,
  UNUSED_193 = 1194,
  UNUSED_194 = 1195,
  UNUSED_195 = 1196,
  UNUSED_196 = 1197,
  UNUSED_197 = 1198,
  UNUSED_198 = 1199,
  UNUSED_199 = 1200,
  UNUSED_200 = 1201
}

/** Nullable types

 We use it primarely for updates to differentiate between
 absent thrift parameters and null values, i.e:
 param: NString() would indicate a null value,
 param: NString('value') would be some value and
 param: null would indicate an absent value for
 a thrift parameter */

struct NullableString { 1: optional string  strValue }
struct NullableI32    { 1: optional i32     int32Value }
struct NullableDouble { 1: optional double  doubleValue }
struct NullableBool   { 1: optional bool    boolValue }
struct NullableUUID   { 1: optional UUID    uuidValue }

 /** All third party identities types */
enum ThirdPartyIdentityType
{
  AlipayIdentity = 1,
  FacebookIdentity, // User linked with Facebook Account, may login using Facebook
  ConcurIdentity,
  SpotifyIdentity,
  AppleIdentity,
  RdioIdentity,
  BaiduIdentity,
  WechatIdentity,
  PandoraIdentity,
  GoogleIdentity, // User linked with Google Account, may login using Google
  LineIdentity,
  IdmeIdentity,
  FacebookUberPageIdentity,
  YandexIdentity, // Mark Uber users who have once logged in or signed up with Yandex
  TaxiDriverIdentity, // Associate Uber drivers with taxi driver companies
  MasabiIdentity, // Mark Uber users who have once logged in or signed up with Masabi
}

/** Address Info entity */
struct AddressInfo {
  1: optional string name,
  2: optional string street1,
  3: optional string street2,
  4: optional string city,
  5: optional string state,
  6: optional i32 countryId,
  7: optional string zipcode,
}

/** Address entity */
struct Address {
  1: optional UUID addressUuid,
  2: optional AddressType addressType,
  3: optional string name,
  4: optional string street1,
  5: optional string street2,
  6: optional string city,
  7: optional string state,
  8: optional i32 countryId,
  9: optional string zipcode,
  10: optional DateTime createdAt,
  11: optional DateTime updatedAt,
  12: optional DateTime deletedAt,
}

struct FreightUserPermissions {
  1: optional bool canSeePrice,
  2: optional bool canBookLoad,
}

/** Freight entity */
struct FreightInfo {
  1: optional i32 fleetSize,
  2: optional string fleetSizeDescription,
  3: optional string mcOrDotNumber,  // deprecated
  4: optional string carrierPacketUrl,
  5: optional string role,
  6: optional UUID carrierUserUuid,
  7: optional DateTime createdAt,
  8: optional DateTime updatedAt,
  9: optional DateTime deletedAt,
  10: optional FreightCarrierStatus carrierStatus,
  11: optional string mcNumber,
  12: optional string dotNumber,
  13: optional FreightUserStatus userStatus,
  14: optional FreightUserRole userRole,
  15: optional UUID createPasswordNotificationLastSentBy,
  16: optional DateTime createPasswordNotificationLastSentTime,
  17: optional string externalVerificationEmail,
  18: optional bool isExternalEmailVerified,
  19: optional FreightUserPermissions permissions,
}

struct AttributionMetadata {
  1: optional string name,
  2: optional string value,
}

struct AttributionSubChannel {
  1: optional string name,
  2: optional string value,
}

/** Marketing/other acquisition channel information for signup, reengagement, specific orders etc */
struct MarketingAttributedEvent {
  1: optional string eventType,
  2: optional string channel,
  3: optional list<AttributionSubChannel> subChannels,
  4: optional string source,
  5: optional DateTime spendRecordedAt,
  6: optional DateTime createdAt,
  7: optional DateTime updatedAt,
  8: optional DateTime clickTimestamp,
  9: optional string channelGroup,
  10: optional string platform,
  11: optional string subPlatform,
  12: optional string referringDomain,
  13: optional string uberAdId,
  14: optional DateTime impressionTimestamp,
  15: optional list<AttributionMetadata> metadata,
}

/** Used in request to choose a specific user attribution for a user based on eventType, source, channel and create time.  */
struct MarketingAttributedEventSelector {
  1: optional string eventType,
  2: optional string channel,
  3: optional string source,
  4: optional DateTime createdAt,
}

/** Wrapper for update marketing attribution request */
struct UpdateMarketingAttributedEventRequest {
  1: optional UUID userUuid,
  2: optional MarketingAttributedEventSelector selector,
  3: optional MarketingAttributedEvent updatedEvent,
}

/** UserAttribute entity a key, value pair with
 a timestamp */
struct UserAttribute
{
  1: required string key,
  2: optional string value,

  3: optional DateTime createdAt,
  4: optional DateTime updatedAt,
  5: optional DateTime deletedAt,
}

/** Alternate email entity */
struct UserEmail
{
  1: required string email,

  /** confirmation token we use for verification of an email*/
  2: optional string confirmationToken,

  /** is email confirmed */
  3: optional bool   isConfirmed,

  /** an actual payment profile random (unsharded) uuid we couple with the email*/
  4: optional UUID   paymentProfileUuid,

  5: optional DateTime createdAt,
  6: optional DateTime updatedAt,
}

/** For caching UserEmail */
struct UserEmails
{
  1: required list<UserEmail> emails,
}

/** UserNote entity */
struct UserNote
{
  1: required string note,

  /** user's uuid who created a note*/
  2: optional UUID createdByUserUuid,

  /** user's uuid who updated a note*/
  3: optional UUID updatedByUserUuid,

  4: optional DateTime createdAt,
  5: optional DateTime updatedAt,
  6: optional DateTime deletedAt,

  7: optional string id
}

/** DriverStatus entity */
struct DriverStatusEntity
 {
  1: optional DriverStatus driverStatus,
  /** usually in JSON blob format */
  2: optional string notes,
  3: optional UUID createdByUserUuid,
  4: optional UUID updatedByUserUuid,
  5: optional DateTime createdAt,
  6: optional DateTime updatedAt,
  8: optional string id
}

struct PaymentProfileByProduct {
  1: optional Product product
  2: optional UUID paymentProfileUUID
}

/** Request params for updatable user fields. */
struct UpdateUserInfoRequest
{
  1: optional string firstname,
  2: optional string lastname,
  3: optional string location,
  4: optional i32 countryId,
  5: optional i32 languageId,
  6: optional string nickname,
  7: optional double gratuity,
  8: optional string email,
  9: optional string mobile,
  10: optional string mobileCountryIso2,
  /** Fields that are used in updating mobile number */
  /* TODO: remove isExemptedFromConfirmingMobile and force clients to go through
   * setClientMobileConfirmationStatus */
  11: optional bool isExemptedFromConfirmingMobile,
  12: optional string deviceId,
  13: optional bool cardio,
  /**
   * This UUID is what the Money team calls a "random" (unsharded) payment
   * profile UUID. The Money team stores payment profiles in a schemaless
   * instance called Trifle and shards them using their respective user UUID.
   * Unless explicitly stated, Money services endpoints do not expect those
   * "random" UUID, instead they expect a "trifle" (sharded) uuid, more info
   * at: https://engdocs.uberinternal.com/BANKEMOJI/.
   */
  14: optional UUID lastSelectedPaymentProfileUuid,
  15: optional DateTime dateOfBirth,
  16: optional string preferredName,
  17: optional bool identityVerified,
  18: optional string paymentEntityType,
  /* Reject reason for user's identityVerified status */
  19: optional UUID identityRejectReasonUuid,

  20: optional GenderType genderInferred,
  21: optional GenderType genderIdentity,
  22: optional GenderType genderDocumented,
  23: optional bool riderIneligibleWdw,
  /*  See https://erd.uberinternal.com/projects/b2c41685-dabe-4333-8a23-7ae4ae0e85f9
  * convert to map<Product, UUID> in C2.0
  */
  24: optional list<PaymentProfileByProduct> defaultPaymentProfileByProduct,

}

struct UpdateDriverInfoRequest {
  1: optional string iphone,
  2: optional bool receiveSms,
  3: optional string twilioNumber,
  4: optional string twilioNumberFormatted,
  5: optional string contactinfo,
  6: optional string contactinfoCountryCode,
  7: optional DriverCompensationType driverType,
}

struct UpdateDriverStatusRequest {
  1: optional DriverStatusEntity driverStatusEntity
}

struct UpdatePartnerInfoRequest {
  1: optional string company,
  2: optional i32 cityId,
  3: optional string state,
  4: optional string zipcode,
  5: optional string cityName,
  6: optional string vatNumber,
  7: optional string address,
  8: optional string address2
  9: optional UUID preferredCollectionPaymentProfileUuid, /* random (unsharded) uuid */
  10: optional PartnerStatus partnerStatus,
  /**
   * If set (even set as empty list) will overwrite the whole list of fleet types
   * to the new specified types.
   */
  11: optional list<FleetType> fleetTypes,
  /**
   * If set (even set as empty list) will overwrite the whole list of fleet services
   * to the new specified services.
   */
  12: optional list<FleetService> fleetServices,
  /* Indicates if this partner is a fleet partner. */
  13: optional bool isFleet,
}

struct UpdateFreightInfoRequest {
  1: optional i32 fleetSize,
  2: optional string fleetSizeDescription,
  3: optional string mcOrDotNumber,  // deprecated
  4: optional string carrierPacketUrl,
  5: optional string role,
  6: optional UUID carrierUserUuid,
  7: optional FreightCarrierStatus carrierStatus,
  8: optional string mcNumber,
  9: optional string dotNumber,
  10: optional FreightUserStatus userStatus,
  11: optional FreightUserRole userRole,
  12: optional UUID createPasswordNotificationLastSentBy,
  13: optional DateTime createPasswordNotificationLastSentTime,
  14: optional string externalVerificationEmail,
  15: optional bool isExternalEmailVerified,
  16: optional FreightUserPermissions permissions,
}

struct UpdateNationalIdRequest {
  1: required string nationalId,
  2: required NationalIdType nationalIdType,
}

/** Merchant in identities, patch it to getUserXXX in order to help upstream clients to identify type of identity */

enum BusinessType {
  RESTAURANT_TAKEOUT = 1,
  RETAIL_SHOPPING,
  GROCERY_SPECIALTY,
  FLORIST,
  PROFESSIONAL_CREATIVE,
  REAL_ESTATE,
  REPAIRS_CLEANING,
  WHOLESALE_TRADE,
  OTHER
}

enum MerchantLocationType {
  LOCATION = 1,
  BUSINESS = 2,
}

enum FreightUserStatus {
  ACTIVE = 1,
  SUSPENDED = 2,
  INACTIVE = 3,
  SIGNED_UP = 4,
  INITIATED = 5,
  UNUSED_TYPE6 = 6,
}

enum FreightUserRole {
  DRIVER = 1,
  DISPATCHER = 2,
  DRIVER_DISPATCHER = 3,
  FACTORING_COMPANY = 4,
  UNUSED_TYPE5 = 5,
  UNUSED_TYPE6 = 6,
}

enum FreightCarrierStatus {
  INITIATED = 1,
  ACTIVE = 2,
  SUSPENDED = 3,
  INACTIVE = 4,
  SIGNED_UP = 5,
  UNUSED_TYPE6 = 6,
  UNUSED_TYPE7 = 7,
  UNUSED_TYPE8 = 8,
  UNUSED_TYPE9 = 9,
  UNUSED_TYPE10 = 10,
  UNUSED_TYPE11 = 11,
}

// enum for Fleet Type: The high level types of the fleet business model.
enum FleetType {
  /**
   * Partner owns vehicles and rents them out to drivers, driver pays fixed
   * price to the partner
   */
  RENTAL = 1,
  /**
   * Partner owns vehicles, earnings on Uber platform are shared proportionally
   * between partner and driver (or driver is paid fixed salary)
   */
  TRANSPORTATION = 2,
  /**
   * Partner does not own vehicles, only provides services to enable drivers to
   * drive with the Uber platform
   */
  CONNECTOR = 3,
  UNUSED_TYPE4 = 4,
  UNUSED_TYPE5 = 5,
  UNUSED_TYPE6 = 6,
  UNUSED_TYPE7 = 7,
  UNUSED_TYPE8 = 8,
  UNUSED_TYPE9 = 9,
  UNUSED_TYPE10 = 10,
  UNUSED_TYPE11 = 11,
  UNUSED_TYPE12 = 12,
}

// enum for Fleet Services: additional services each fleet may provide
enum FleetService {
  /** Outreach and onboarding */
  ONBOARDING = 1,
  /** Provides legal and/or tax permits to allow drivers get on the Uber platform */
  ENABLEMENT = 2,
  /** Provides ongoing support to drivers on the Uber platform */
  SUPPORT = 3,
  /** Payments and accounting. Helps drivers collect and manage their Uber earnings */
  PAYMENTS = 4,
  /** Help prospective drivers get financing for vehicles to drive on the Uber platform */
  FINANCE = 5,
  /** Other services */
  OTHER = 6,
  UNUSED_TYPE7 = 7,
  UNUSED_TYPE8 = 8,
  UNUSED_TYPE9 = 9,
  UNUSED_TYPE10 = 10,
  UNUSED_TYPE11 = 11,
  UNUSED_TYPE12 = 12,
}

struct MerchantLocation {
  /** merchant info */
  1: optional UUID uuid,
  2: optional i32 maxDeliveryRadius,
  3: optional string deliveryInstruction,
  4: optional string priceBucket,
  5: optional double deliveryFee,
  6: optional i32 averagePrepareTime
  /** identity info */
  7: optional string tenancy,
  8: optional string email,
  9: optional string phone,
  10: optional double longitude,
  11: optional double latitude,
  /** organization info */
  12: optional string merchantName,
  13: optional BusinessType businessType,
  14: optional i32 countryId,
  15: optional UUID territoryUUID,
  16: optional i32 regionId,
  17: optional string timezone,
  18: optional i32 timezoneOffsetSeconds,
  19: optional DateTime createdAt,
  20: optional DateTime updatedAt,
  21: optional MerchantLocationType type,
}

/* User Profiles */

enum ProfileType {
  Personal = 0,
  Business = 1,
  ManagedBusiness = 2,
  ManagedFamily = 3,
  Commuter = 4
}

enum BillingMode {
  Centralized = 0,
  Decentralized = 1
}

enum SummaryPeriod {
  Weekly = 0,
  Monthly = 1
}

/** ExpenseProvider is deprecated. For new expense providers, please use ExpenseProviderV2 */
enum ExpenseProvider {
  EXPENSIFY,
  CONCUR,
  CERTIFY,
  CHROME_RIVER,
}

enum ExpenseProviderV2 {
  EXPENSIFY = 0,
  CONCUR,
  CERTIFY,
  CHROME_RIVER,
  SERKO_ZENO,
  RYDOO,
  HAPPAY,
  EXPENSYA,
  ZOHO_EXPENSE,
  UNUSED_1,
  UNUSED_2,
  UNUSED_3,
  UNUSED_4,
  UNUSED_5,
  UNUSED_6,
  UNUSED_7,
  UNUSED_8,
  UNUSED_9,
  UNUSED_10,
  UNUSED_11,
  UNUSED_12,
  UNUSED_13,
  UNUSED_14,
  UNUSED_15,
  UNUSED_16,
  UNUSED_17,
  UNUSED_18,
  UNUSED_19,
  UNUSED_20,
}

enum InAppTermsAcceptedState {
  NOT_APPLICABLE = 1,
  ACCEPTED = 2,
  NOT_ACCEPTED = 3,
}

enum Product {
  RIDER = 0,
  EATS,
  UNUSED_1,
  UNUSED_2,
  UNUSED_3,
  UNUSED_4,
  UNUSED_5,
  UNUSED_6,
  UNUSED_7,
  UNUSED_8,
  UNUSED_9,
  UNUSED_10,
  UNUSED_11,
  UNUSED_12,
  UNUSED_13,
  UNUSED_14,
  UNUSED_15,
  UNUSED_16,
  UNUSED_17,
  UNUSED_18,
  UNUSED_19,
  UNUSED_20,
}

/** UserProfileLogo entity */
struct UserProfileLogo
{
  1: required string url;
  2: optional i16 width;
  3: optional i16 height;
}

/** UserProfileTheme entity */
struct UserProfileTheme
{
  1: optional string color,
  2: optional string initials,
  3: optional string icon,
  4: optional map<string, list<UserProfileLogo>> logos,
}

/** EntityProfileAttributes entity */
struct EntityProfileAttributes
{
  1: optional BillingMode billingMode,
  2: optional string name,
  3: optional UserProfileTheme theme,
  4: optional string memberUuid,
  5: optional string groupUuid,
  6: optional bool isOrganizer;
  7: optional byte version;
  /** allowedExpenseProviders is deprecated. Please use allowedExpenseProvidersV2 for new providers */
  8: optional set<ExpenseProvider> allowedExpenseProviders;
  /** ExpenseProvider is an enum and cannot take new enums so
      creating V2 version to support more expense providers.
      See https://code.uberinternal.com/D1985875 */
  9: optional set<ExpenseProviderV2> allowedExpenseProvidersV2;
}

typedef string BusinesssIntegrationType

const BusinesssIntegrationType CONCUR_EXPENSE_PROVIDER = "CONCUR"

/**
 * BusinessIntegration is struct to hold details about
 * users business related thrird party integrations like concur, expensify
 * These fields will be populated after doing oAuth from third parties.
 * Foe more Details in T2145615
 **/
struct BusinessIntegration
{
   1: optional BusinesssIntegrationType businessIntegrationType
   /*
   thirdPartyUserUuid is the user uuid outside user.
   like their uuid in concur systems. Need this to call
   their endpoints
    */
   2: optional string thirdPartyUserUuid,
   /*
   accessToken is what is used to auth the request
   for user when calling third party APIs.
   May not required be required for all but for
   those who use oAuth2.0. This is usually short term
   like 1 hr, and is required to be stores if user makes more than
   1 request within an hour.
    */
   3: optional string accessToken,
   /*
   refreshToken is a long terms token(usually 6 months)
   that is used to exhange for access token in
   oAuth flow.
    */
   4: optional string refreshToken,
   /*
   expiry date of refresh token. May vary from third party.
    */
   5: optional DateTime refreshTokenExpiry,
   6: optional DateTime businessIntegrationUpdatedAt,
   7: optional DateTime businessIntegrationDeletedAt,
}

/** ManagedBusinessAttributes entity */
struct ExtraManagedBusinessAttributes
{
  1: optional InAppTermsAcceptedState inAppTermsAccepted;
  2: optional bool isConvertedFromUnmanaged;
}

/** InAppLinkingAttributes entity */
struct InAppLinkingAttributes
{
  1: optional InAppTermsAcceptedState inAppTermsAccepted;
  2: optional UUID unconfirmedEmployeeUuid;
  3: optional bool isDecentralized;
  4: optional bool userHadExistingUnmanaged;
}

/** ExtraProfileAttributes entity */
struct ExtraProfileAttributes
{
  1: optional ExtraManagedBusinessAttributes extraManagedBusinessAttributes
  2: optional InAppLinkingAttributes inAppLinkingAttributes
  3: optional BusinessIntegration businessIntegration
}

/** UserProfile entity */
struct UserProfile
{
  1: required UUID userProfileUuid,
  2: required ProfileType type,

  3: optional UUID defaultPaymentProfileUuid, /* random (unsharded) uuid */
  4: optional string email,

  5: optional UUID entityUuid,
  6: optional EntityProfileAttributes entityProfileAttributes,

  7: optional bool isExpensingEnabled,
  8: optional bool isVerified,
  9: optional string name,
  10: optional string status,

  11: optional set<SummaryPeriod> summaryStatementPeriods,
  12: optional UserProfileTheme theme,

  13: optional DateTime createdAt,
  14: optional DateTime updatedAt,
  15: optional DateTime deletedAt,
  16: optional UUID createdByUserUuid,
  17: optional UUID updatedByUserUuid

  /** activeExpenseProviders is deprecated. Please use activeExpenseProvidersV2 for new providers */
  18: optional set<ExpenseProvider> activeExpenseProviders;
  19: optional UUID secondaryPaymentProfileUuid;
  20: optional ExtraProfileAttributes extraProfileAttributes;

  /** ExpenseProvider is an enum and cannot take new enums so
      creating V2 version to support more expense providers.
      See https://code.uberinternal.com/D1985875 */
  21: optional set<ExpenseProviderV2> activeExpenseProvidersV2;
  /**
  * defaultPaymentProfileByProduct is the mapping from line of business(rider, eats, bike)
  * to default payment profile.See https://code.uberinternal.com/T1772501
   **/
  22: optional map<Product, UUID> defaultPaymentProfileByProduct;
}

/** UserProfiles entity is only used for caching profiles */
struct UserProfiles {
  1: optional list<UserProfile> profiles
}

/** UserTag entity
 * Note: No tier 0/1 service should depend on existence of tags in their critical paths and should always treat tags
 * as optional read only properties.
 */
struct UserTag
 {
   /** User tag name */
  1: required string name,

  /** additional note for a user tag */
  2: optional string note,

  /** additional set of notes, usually in JSON blob format. Legacy data. */
  3: optional string notes,

  4: optional DateTime createdAt,
  5: optional DateTime updatedAt,
  6: optional DateTime deletedAt,
}

/** UserRoleInfo entity */
struct UserRoleInfo
{
  /** Client vs Driver vs Partner */
  1: optional UserRole role,

  /** Whether this user is super-admin */
  2: optional bool isSuperAdmin,

  /** Whether this user is admin */
  3: optional bool isAdmin,

  /** Whether this user is restricted */
  4: optional bool isRestricted,

  /** Whether this user is banned */
  5: optional bool isBanned
}

/** UserTrait entity */
struct UserTrait
{
  1: required UUID   traitUuid,

  /** trait name */
  2: required string name,

  /** trait descrition */
  3: optional string description,

  4: optional DateTime createdAt,
  5: optional DateTime updatedAt,
  6: optional DateTime deletedAt,
}

/** UserTraitMap entity*/
struct UserTraitMap
{
  /** trait uuid */
  1: required UUID   traitUuid,
  2: optional DateTime createdAt,
  3: optional DateTime deletedAt,
}

/** Reward entity, part of PaymentProfileView */
struct Reward
{
  /** currently only AMEX rewards are supported */
  1: required string rewardType,
  2: optional string eligibleFor,

  3: optional bool enabled,
  4: optional bool enrolled,
}

/** PSP specific info in payment profile */
struct PaymentProfileVendorData
{
  /** processor code for PSPs with a backing provider */
  1: optional string processorCode,
}

/** Brazil Combo Cards preference */
enum ComboCardInfoFunction {
  DEBIT = 1,
  CREDIT,
}

/** Payment Profile View entity */
struct PaymentProfileView
{
  /** payment profile uuid */
  1:  required UUID	uuid,

  /** user uuid */
  2:  optional UUID 	clientUuid,

  /** first 6 digits in a credit card numnber*/
  3:  optional string   cardBin,

  /** last 4 characters in a credit card number */
  4:  optional string   cardNumber,

  /** type: AmEx, MasterCard, etc */
  5:  optional string   cardType,

  /** card expiration date */
  6:  optional DateTime cardExpiration,

  /** credit cards: last 4 digits of a credit card number,
     for AliPay/PayPal it's email address*/
  7:  optional string   displayName,

  8:  optional string   billingZip,
  9:  optional string   billingCountryIso2,

  /** personal/business label */
  10: optional string   label,

  /**	active/pending */
  11: optional string   status,

  /** all supported payment types: alipay, applepay,
   braintree, etc*/
  12: optional string   tokenType,

  /** all the rewards, currently only a single Amex reward
     per payment profile is supported */
  13: optional list<Reward> rewards,

  14: optional DateTime createdAt,
  15: optional DateTime updatedAt,

  /** PSP specific data in payment profile */
  16: optional PaymentProfileVendorData vendorData,

  /** Brazil Combo Cards function */
  17: optional ComboCardInfoFunction comboCardFunction
}


/** Promotion Code entity */
struct PromotionCode
{
  /** Deprecated. promo code id reference */
  1: required i32     promotionCodeId,

  /** Deprecated.  promo code uuid reference*/
  2: optional UUID   promotionCodeUuid,

  /** promotion code*/
  3: optional string  promotionCode,

  /** Deprecated */
  4: optional DateTime createdAt,

  /** Deprecated */
  5: optional DateTime updatedAt,
}

/** ThirdPartyIdentity entity */
struct ThirdPartyIdentity
{
  /** all supported identity types*/
  1: required ThirdPartyIdentityType identityType,

  /** third party user id*/
  2: optional string thirdPartyUserId,

  /** third party access token*/
  3: optional string accessToken,

  /** access token expiration date*/
  4: optional DateTime accessTokenExpiry,

  5: optional string refreshToken,
  6: optional string thirdPartyUserSecret,

  /** some meta information specific for
   third party identity, like facebook friends count*/
  7: optional string meta,

  8: optional DateTime createdAt,
  9: optional DateTime updatedAt,
}

/** ThirdPartyIdentity entity. This controls the fields that can be updated
through the updateThirdPartyIdentity endpoint. */
struct UpdateThirdPartyIdentityFields
{
  /** third party access token*/
  1: optional string accessToken,

  /** access token expiration date*/
  2: optional DateTime accessTokenExpiry,
}

/** This struct encapsulates the parameters passed to a createThirdPartyIdentity call.*/
struct CreateThirdPartyIdentityFields
{
  1: required ThirdPartyIdentity tpi,
  2: optional string accessTokenCode,
  3: optional string redirectUri,
}

/** This struct encapsulates the parameters passed to the getUserByTPIAccessToken call. */
struct GetUserByTPIAccessTokenFields
{
  1: required ThirdPartyIdentityType identityType,
  2: optional string accessToken
  3: optional string accessTokenCode
}

/**
 * Encapsulates lock status of Fraud, Safety and Compliance under DriverInfo level.
 * Deactivated or reactivated by a specific subset of users at Uber whose job
 * function involves reviewing and managing fraud deactivation cases.
 **/
struct StatusLocks
{
  /** Driver account lock for fraud temporary */
  1: optional bool lockFraud,
  /** Driver account lock for fraud permanent */
  2: optional bool lockFraudPermanent,
  /** Driver account lock for safty temporary */
  3: optional bool lockSafety,
  /** Driver account lock for safty permanent */
  4: optional bool lockSafetyPermanent,
  /** Driver account lock for compliance temporary */
  5: optional bool lockCompliance,
  /** Driver account lock for compliance permanent */
  6: optional bool lockCompliancePermanent,
  /** StatusLocks created at */
  7: optional DateTime createdAt,
  /** StatusLocks updated at */
  8: optional DateTime updatedAt,
  /** StatusLocks deleted at */
  9: optional DateTime deletedAt,
}

/**
 * Create/Update FraudActions lock status. All locks are optional.
 **/
struct UpdateFraudActionsRequest {
  /** Driver account lock for fraud temporary */
  1: optional bool lockFraud,
  /** Driver account lock for fraud permanent */
  2: optional bool lockFraudPermanent,
  /** Driver account lock for safty temporary */
  3: optional bool lockSafety,
  /** Driver account lock for safty permanent */
  4: optional bool lockSafetyPermanent,
  /** Driver account lock for compliance temporary */
  5: optional bool lockCompliance,
  /** Driver account lock for compliance permanent */
  6: optional bool lockCompliancePermanent,
}

/**
 * Create/Update lock status. All locks are optional.
 **/
struct UpdateStatusLocksRequest {
  /** Driver account lock for fraud temporary */
  1: optional bool lockFraud,
  /** Driver account lock for fraud permanent */
  2: optional bool lockFraudPermanent,
  /** Driver account lock for safty temporary */
  3: optional bool lockSafety,
  /** Driver account lock for safty permanent */
  4: optional bool lockSafetyPermanent,
  /** Driver account lock for compliance temporary */
  5: optional bool lockCompliance,
  /** Driver account lock for compliance permanent */
  6: optional bool lockCompliancePermanent,
}

/** Driver Engagement struct */
struct DriverEngagement {
    1: optional i32 engagementCityId
    2: optional EngagementTier tier
    /** qualifyingPoints expire at the end of each qualification period */
    3: optional Points qualifyingPoints
    4: optional Points lifetimeRewardPoints
    5: optional DateTime qualificationPeriodStartsAt
    6: optional DateTime tierExpiresAt
    7: optional DateTime qualificationPeriodEndsAt
    8: optional DriverEngagementStatus status
    9: optional bool isEnrolled
    10: optional DateTime enrolledAt
}

/** Courier Engagement struct */
struct CourierEngagement {
    1: optional i32 engagementCityId
    2: optional EngagementTier tier
    /** qualifyingPoints expire at the end of each qualification period */
    3: optional Points qualifyingPoints
    4: optional Points lifetimeRewardPoints
    5: optional DateTime qualificationPeriodStartsAt
    6: optional DateTime tierExpiresAt
    7: optional DateTime qualificationPeriodEndsAt
    8: optional CourierEngagementStatus status
    9: optional bool isEnrolled
    10: optional DateTime enrolledAt
}

/** Rider (Client) Engagement struct */
struct RiderEngagement {
    1: optional i32 engagementCityId
    2: optional EngagementTier tier
    /** qualifyingPoints expire at the end of each qualification period */
    3: optional Points qualifyingPoints
    4: optional Points lifetimeRewardPoints
    5: optional DateTime qualificationPeriodStartsAt
    6: optional DateTime tierExpiresAt
    7: optional DateTime qualificationPeriodEndsAt
    8: optional bool isEnrolled
    9: optional DateTime enrolledAt
}

/** User Login Eligibility struct, to deny login to user for reasons
other than being banned (e.g. duplicate account) */
struct LoginEligibility {
    1: optional bool denyLogin
    2: optional string denyLoginReason
}

/** DriverInfo entity */
struct DriverInfo
{
  /** Driver's phone number */
  1:  optional string contactinfo,

  /** Driver's phone number country code */
  2:  optional string contactinfoCountryCode,

  /** Driver license */
  3:  optional string driverLicense,

  /** 4-6 are deprecated rating fields, which should not be reused */

  /** first trip uuid */
  7:  optional UUID   firstDriverTripUuid,

  /** serial number of an iphone */
  8:  optional string iphone,

  /** partner uuid */
  9:  optional UUID   partnerUserUuid,

  /** flag indicating if a driver can receive sms messages*/
  10: optional bool   receiveSms,

  /** twillio number if it's been provisioned*/
  11: optional string twilioNumber,

  /** formatted twillio number, oh god why? */
  12: optional string twilioNumberFormatted,

  13: optional i32    cityknowledgeScore,  /** drop it? */

  14: optional DateTime createdAt,
  15: optional DateTime updatedAt,
  16: optional DateTime deletedAt,
  17: optional DriverStatus driverStatus,
  18: optional DriverFlowType driverFlowType,
  19: optional StatusLocks statusLocks,

  /** Driver's phone number country ISO2 code */
  20:  optional string contactinfoCountryIso2Code,

  /** Driver engagement structs */
  53: optional DriverEngagement driverEngagement,
  
  /** Courier engagement struct */
  54: optional CourierEngagement courierEngagement,
}

/** PartnerInfo entity */
struct PartnerInfo
{
  /** Partner's business address */
  1:  optional string address,

  /** territory uuid */
  2:  optional UUID   territoryUuid,

  /** company business name */
  3:  optional string company,

  /** address2 */
  4:  optional string address2,

  /** city name */
  15: optional i32 cityId,
  5:  optional string cityName,

  6:  optional UUID   firstPartnerTripUuid,

  /** partner collection payment profile random (unsharded) uuid */
  16: optional UUID preferredCollectionPaymentProfileUuid,

  /**partner's phone number*/
  7:  optional string phone,
  8:  optional string phoneCountryCode,
  9:  optional string state,
  10: optional string vatNumber,
  11: optional string zipcode,

  12: optional DateTime createdAt,
  13: optional DateTime updatedAt,
  14: optional DateTime deletedAt,

  /**
   * If this partner is a fleet / fleet manager, this field represents which high-level type[s] of fleet it is.
   * This field may be empty if the partner is not a fleet, or if they never filled out the survey.
   */
  17: optional list<FleetType> fleetTypes,

  /**
   * If this partner is a fleet / fleet manager, this struct represents which additional services the fleet provides.
   * This field may be empty if the partner is not a fleet, or if they never filled out the survey.
   */
  18: optional list<FleetService> fleetServices,

  /* Indicates if this partner is a fleet. */
  19: optional bool isFleet,
}

/** User Analytics entity */
struct UserAnalytics
{
  1:  optional double signupLat,
  2:  optional double signupLng,
  3:  optional UUID   signupTerritoryUuid,
  4:  optional i32    signupPromoId,
  5:  optional string signupForm,
  6:  optional string signupSessionId,
  7:  optional string signupAppVersion,
  8:  optional string signupAttributionMethod,
  9: optional DateTime createdAt,
  10: optional DateTime updatedAt,
  11: optional i32    signupCityId,
  12: optional string signupDeviceId,
  13: optional string signupReferralId,
  14: optional string signupPromoCode,
  15: optional UUID   signupPromoCodeUuid,
  16: optional UUID   signupPromoUuid,
  17: optional SignupMethod signupMethod,
}

/** User entity */
struct User
{
  1:  required UUID   uuid,
  2:  optional string firstname,
  3:  optional string lastname,

  4:  optional UserRole role,

  5:  optional i32 languageId,
  6:  optional i32 countryId,

  /** mobile phone number of a user */
  7:  optional string mobile,
  /** mobile token for confirming mobiles*/
  8:  optional i32    mobileToken,

  /** mobile country ids and country codes*/
  9:  optional i32    mobileCountryId,
  10: optional string mobileCountryCode,

  /** for US +1 we don't have an unambiguous way
   of resolving mobile numbers as there are multiple
   countries have the same country code in thei phone numbers
   */
  11: optional bool   hasAmbiguousMobileCountry,

  12: optional i32    lastConfirmedMobileCountryId,

  13: optional string email,

  /** email token for confirming email address*/
  14: optional string emailToken,

  /** confirmed mobile flag */
  /** deprecated, please use mobileConfirmationStatus instead */
  15: optional string hasConfirmedMobile,

  16: optional bool   hasOptedInSmsMarketing,

  /** confirmed email flag */
  17: optional bool    hasConfirmedEmail,

  /** default gratuity percentage, default 0.2 */
  18: optional double gratuity,

  /** client's nickname, mostly the same as
   email, we have some drivers with different nicknames*/
  19: optional string nickname,

  /** Zip code */
  20: optional string location,

  /** fraudy clients are banned */
  21: optional bool   banned,
  22: optional bool   cardio,

  /** authentication token */
  23: optional string token,

  /** fraud score, generally in a range
   of low, medium and high */
  24: optional double fraudScore,

  /** uuid of an inviter*/
  25: optional UUID   inviterUuid,

  /** picture url */
  26: optional string pictureUrl,

  /** 27 is deprecated rating field, which should not be reused */

  /** for shared rides participants in sharing
   a trip fare */
  28: optional list<UUID> recentFareSplitterUuids,

  /** selected(default) payment profile uuid*/
  29: optional UUID lastSelectedPaymentProfileUuid,

  /** selected(default) google wallet payment profile uuid*/
  30: optional UUID lastSelectedPaymentProfileGoogleWalletUuid,

  /** Promo Code */
  31: optional PromotionCode inviteCode,

  32: optional DriverInfo    driverInfo,
  33: optional PartnerInfo   partnerInfo,
  34: optional UserAnalytics analytics,

  35: optional DateTime createdAt,
  36: optional DateTime updatedAt,
  37: optional DateTime deletedAt,

  /** Tenancy */
  38: optional string tenancy,

  39: optional MobileConfirmationStatus mobileConfirmationStatus,

  40: optional string nationalId,
  41: optional NationalIdType nationalIdType,

  42: optional MerchantLocation merchantLocation,

  43: optional string lastConfirmedMobile,
  44: optional DateTime requestedDeletionAt,

  45: optional DateTime dateOfBirth,

  46: optional list<UserType> userTypes,
  47: optional string preferredName,
  48: optional FreightInfo freightInfo,
  // DO NOT USE tempPictureUrl. This value should only be used by Document processing.
  // Please consult ng@uber.com or driver-docs@uber.com.
  49: optional string tempPictureUrl,

  50: optional bool identityVerified,  /* user's identity has been verified by KYC standards */
  51: optional string paymentEntityType,   /* is this user an individual or a business */

  /** Rider engagement structs */
  52: optional RiderEngagement riderEngagement,

  53: optional UUID identityRejectReasonUuid,  /* reject reason for user's identityVerified */

  54: optional GenderType genderInferred,
  55: optional GenderType genderIdentity,
  56: optional GenderType genderDocumented,
  57: optional bool riderIneligibleWdw,

  /**
   * defaultPaymentProfileByProduct is the mapping from line of business
   * (rider, eats, bike) to default payment profile.
   * See https://erd.uberinternal.com/projects/b2c41685-dabe-4333-8a23-7ae4ae0e85f9
   * convert to map<Product, UUID> in C2.0
  **/
  58: optional list<PaymentProfileByProduct> defaultPaymentProfileByProduct;

  /** Ability to deny login to user for reasons other than being banned */
  59: optional LoginEligibility loginEligibility,

}

/** User with Tag Names **/
struct UserWithTagNames
{
  1: optional User user,
  2: optional set<string> tagNames,
}

/** Exported User */
struct ExportedUser
{
  1: required User user,
  2: optional bool canMuber,
  3: optional bool isAdmin,
  4: optional map<string, UserTag>      tags,
  5: optional list<PaymentProfileView>   paymentProfileViews,
  6: optional list<ThirdPartyIdentity>   thirdPartyIdentities,
  7: optional list<UserNote>     notes,
  8: optional map<string, UserTraitMap>  traits,
  9: optional map<string, UserEmail>  alternateEmails,
}


/** simple derived fields that could be computed from user object directly */
struct DerivedFields
{
  /** user's has_confirmed_mobile status in plain English, such as 'Exempted by admin' */
  1: optional string hasConfirmedMobileStatus,
  /** 2 is deprecated rating field, which should not be reused */
  /** true if an admin exempted the user from confirming their mobile */
  3: optional bool isExemptedFromConfirmingMobile,
  /** true if the user is some form of "mobile exempt." The most common example where this would
  return "True" is in a country where text messages don't work very well. */
  4: optional bool isMobileExempt,
  /** mobile phone number formatted according to country code. E.g.: "+1 513-336-6688" */
  5: optional string mobileLocal,
  /** the language code corresponding to the language id, such as 'en', 'es_MX' */
  6: optional string languageCode,
  /** formatted driver contactInfo*/
  7: optional string driverContactInfoFormatted,
  /** referral url for rider signup*/
  8: optional string riderReferralUrl,
  /** referral url for driver signup*/
  9: optional string driverReferralUrl
}

/** derived fields that need to be computed using info from user tags/attributes */
struct ExtendedDerivedFields
{
  /** claimed mobile phone number formatted according to country code, E.g.: "+1 513-336-6688" */
  1: optional string clientClaimedMobileLocal,
  /** from driver_type tag*/
  2: optional string driverType,
  /** from partner_status tag */
  3: optional string partnerStatus,
  /** base name is formatted company name, some special logic for mini partners */
  4: optional string baseName
}

/** basic information of a fare splitter */
struct FareSplitterInfo {
  1: optional string firstname,
  2: optional string lastname,
  3: optional string mobile,
  4: optional string mobileCountryIso2,
  5: optional string pictureUrl,
}

/** Used for caching. It is the thrift version of User entity **/
struct CompleteUser
{
  1: optional User user,
  /** active tags only */
  2: optional map<string, UserTag> userTags,
  3: optional map<string, UserAttribute> userAttributes,
  4: optional list<ThirdPartyIdentity> thirdPartyIdentities,
  /** user's has_confirmed_mobile status in plain English, such as 'Exempted by admin' */
  5: optional string hasConfirmedMobileStatus,
  /** 6 is deprecated rating field, which should not be reused */
  /** true if an admin exempted the user from confirming their mobile */
  7: optional bool isExemptedFromConfirmingMobile,
  /** true if the user is some form of "mobile exempt." The most common example where this would
  return "True" is in a country where text messages don't work very well. */
  8: optional bool isMobileExempt,
  /** mobile phone number formatted according to country code. E.g.: "+1 513-336-6688" */
  9: optional string mobileLocal,
  /** the language code corresponding to the language id, such as 'en', 'es_MX' */
  10: optional string languageCode,
  /** formatted driver contactInfo*/
  11: optional string driverContactInfoFormatted,
  /** referral url for rider signup*/
  12: optional string riderReferralUrl,
  /** referral url for driver signup*/
  13: optional string driverReferralUrl,
  /** claimed mobile phone number formatted according to country code, E.g.: "+1 513-336-6688" */
  14: optional string clientClaimedMobileLocal,
  /** from driver_type tag*/
  15: optional string driverType,
  /** from partner_status tag */
  16: optional string partnerStatus,
  /** base name is formatted company name, some special logic for mini partners */
  17: optional string baseName,
  /** the iso2 code corresponding to the country id, such as 'US', 'CN' */
  18: optional string countryIso2Code,
  /** Address of partner as a list of strings */
  19: optional list<string> formattedAddress,

  /** List of payment profile views */
  20: optional list<PaymentProfileView> paymentProfileViews,
  /** the iso2 code corresponding to the mobile country id, such as 'US', 'CN' */
  21: optional string mobileCountryIso2Code,
  22: optional map<UUID, UserTraitMap>  userTraits,
  /** has active payment profile that is not a google wallet */
  23: optional bool hasValidPaymentProfile,

  /** country codes for the last confirmed mobile number */
  24: optional string lastConfirmedMobileCountryCode,
  25: optional string lastConfirmedMobileCountryIso2Code,

  /** Driver's phone number country ISO2 code */
  26: optional string driverContactInfoCountryIso2Code
}

/** contains most of info related to a user */
struct ExtendedUser
{
  1: optional User user,
  /** active tags only */
  2: optional map<string, UserTag> userTags,
  3: optional map<string, UserAttribute> userAttributes,
  4: optional list<ThirdPartyIdentity> thirdPartyIdentities,
  /** user's has_confirmed_mobile status in plain English, such as 'Exempted by admin' */
  5: optional string hasConfirmedMobileStatus,
  /** 6 is deprecated rating field, which should not be reused */
  /** true if an admin exempted the user from confirming their mobile */
  7: optional bool isExemptedFromConfirmingMobile,
  /** true if the user is some form of "mobile exempt." The most common example where this would
  return "True" is in a country where text messages don't work very well. */
  8: optional bool isMobileExempt,
  /** mobile phone number formatted according to country code. E.g.: "+1 513-336-6688" */
  9: optional string mobileLocal,
  /** the language code corresponding to the language id, such as 'en', 'es_MX' */
  10: optional string languageCode,
  /** formatted driver contactInfo*/
  11: optional string driverContactInfoFormatted,
  /** referral url for rider signup*/
  12: optional string riderReferralUrl,
  /** referral url for driver signup*/
  13: optional string driverReferralUrl,
  /** claimed mobile phone number formatted according to country code, E.g.: "+1 513-336-6688" */
  14: optional string clientClaimedMobileLocal,
  /** from driver_type tag*/
  15: optional string driverType,
  /** from partner_status tag */
  16: optional string partnerStatus,
  /** base name is formatted company name, some special logic for mini partners */
  17: optional string baseName,
  /** full url of the picture of the user */
  18: optional string fullPictureUrl,
  /** the iso2 code corresponding to the country id, such as 'US', 'CN' */
  19: optional string countryIso2Code,
  /** Address of partner as a list of strings */
  20: optional list<string> formattedAddress,

  /** List of payment profile views */
  22: optional list<PaymentProfileView> paymentProfileViews,
  /** the iso2 code corresponding to the mobile country id, such as 'US', 'CN' */
  23: optional string mobileCountryIso2Code,
  24: optional map<UUID, UserTraitMap>  userTraits,
  /** info of recent fare splitters */
  25: optional list<FareSplitterInfo> recentFareSplitters,
  /** has active payment profile that is not a google wallet */
  26: optional bool hasValidPaymentProfile,

  /** country codes for the last confirmed mobile number */
  27: optional string lastConfirmedMobileCountryCode,
  28: optional string lastConfirmedMobileCountryIso2Code,

  /** cityId only exists for drivers and partners */
  29: optional i32 cityId,
}

struct UserSegment
{
  1: required string name
  2: optional i32 version
  3: optional UUID createdByUserUuid
  4: optional string createdByService
  5: optional DateTime createdAt
  6: optional UUID updatedByUserUuid
  7: optional string updatedByService
  8: optional DateTime updatedAt
  9: optional UUID deletedByUserUuid
  10: optional string deletedByService
  11: optional DateTime deletedAt
}

/** This struct acts as a bit-vector style filter where you could turn on (setting to True) or
off (setting to False) falgs to specify what field(s) to retrieve from ExtendedUser struct. If a
flag is True for a field, there will be value for that field in the returned ExtendedUser,
otherwise, the value for that field will be None. */
struct RequestedFields
{
  1: optional bool user = 0,
  /** active tag only */
  2: optional bool userTags = 0,
  3: optional bool userAttributes = 0,
  4: optional bool thirdPartyIdentities = 0,
  /** user's has_confirmed_mobile status in plain English, such as 'Exempted by admin' */
  5: optional bool hasConfirmedMobileStatus = 0,
  /** 6 is deprecated rating field, which should not be reused */
  /** true if an admin exempted the user from confirming their mobile */
  7: optional bool isExemptedFromConfirmingMobile = 0,
  /** true if the user is some form of "mobile exempt." The most common example where this would
  return "True" is in a country where text messages don't work very well. */
  8: optional bool isMobileExempt = 0,
  /** mobile phone number formatted according to country code. E.g.: "+1 513-336-6688" */
  9: optional bool mobileLocal = 0,
  /** the language code corresponding to the language id, such as 'en', 'es_MX' */
  10: optional bool languageCode = 0,
  /** formatted driver contactInfo*/
  11: optional bool driverContactInfoFormatted = 0,
  /** referral url for rider signup*/
  12: optional bool riderReferralUrl = 0,
  /** referral url for driver signup*/
  13: optional bool driverReferralUrl = 0,
  /** claimed mobile phone number formatted according to country code, E.g.: "+1 513-336-6688" */
  14: optional bool clientClaimedMobileLocal = 0,
  /** from driver_type tag*/
  15: optional bool driverType = 0,
  /** from partner_status tag */
  16: optional bool partnerStatus = 0,
  /** base name is formatted company name, some special logic for mini partners */
  17: optional bool baseName = 0,
  /** full url of the picture of the user */
  18: optional bool fullPictureUrl = 0,
  /** the iso2 code corresponding to the country id, such as 'US', 'CN' */
  19: optional bool countryIso2Code = 0,
  /** Address of partner as a list of strings */
  20: optional bool formattedAddress = 0,

  /** List of payment profile views */
  22: optional bool paymentProfileViews = 0,
  /** the iso2 code corresponding to the mobile country id, such as 'US', 'CN' */
  23: optional bool mobileCountryIso2Code = 0,
  /** user traits map */
  24: optional bool userTraits = 0,
  /** info of recent fare splitters */
  25: optional bool recentFareSplitters = 0,
  /** has active payment profile that is not a google wallet */
  26: optional bool hasValidPaymentProfile = 0,
  /** country codes for the last confirmed mobile number */
  27: optional bool lastConfirmedMobileCountryCode = 0,
  28: optional bool lastConfirmedMobileCountryIso2Code = 0
  /** cityId only exists for drivers and partners */
  29: optional bool cityId = 0
}

/** How user signed up Uber */
enum SignupMethod{
  REGULAR = 1,
  MOBILE_ONLY,
  PASSWORDLESS,
}

/** Mobile Confirmation Status */
enum MobileConfirmationStatus{
  MOBILE_CONFIRMED,
  MOBILE_SMS_CONFIRMED,
  MOBILE_VOICE_CONFIRMED,
  MOBILE_VOICE_CONFIRM_REQUIRED,
  MOBILE_NOT_CONFIRMED,
  MOBILE_EXEMPT,
  MOBILE_EXEMPT_NON_AMERICAN,
  MOBILE_EXEMPT_GLOBAL,
}

struct SearchPagingInfo {
   1: optional string token;
   2: optional i16 limit; /** to be deprecated eventually **/
   /** sorting will slow down pagination significantly, so when order is not needed, no sorting will
    improve pagination performance greatly. **/
   3: optional bool forceNoSorting = 0;
   4: optional i32 limit32; /** use this instead of limit **/
}

struct PagingResult {
   1: optional string nextPageToken;
   2: optional i32 estimatedTotalPages;
}

struct UserPicture {
    /** base64EncodeString is used for new photo stream **/
    1: optional string base64EncodeString;
    /** existingPictureName is used for photos in temporary storage **/
    2: optional string existingPictureName;
}

struct PartnerDriversPagingResult {
    1: required list<User> drivers;
    2: optional PagingResult paging;
}

struct SetClientMobileConfirmationStatusRequest {
    1: required MobileConfirmationStatus status;
    2: optional string mobile;
    3: optional i32 mobileCountryId;
    4: optional string mobileCountryCode;
    5: optional bool shouldConsolidateDriverMobile = 0;
}

struct ReleaseMobileNumberRequest {
    1: optional string nationalNumber;  /** mobile phone number, without the country code*/
    2: optional string countryCode;     /** mobile country code */
}

struct ChangeRoleRequest {
    1: optional UserRole newRole,
    2: optional DriverInfo driverInfo,
    3: optional PartnerInfo partnerInfo,
    4: optional FreightInfo freightInfo,
}

enum UserDataType {
    PROFILE_PHOTO = 1,
    MOBILE,
    USER_NAMES,
    UNUSED_TYPE3,
    UNUSED_TYPE4,
    UNUSED_TYPE5,
    UNUSED_TYPE6,
    UNUSED_TYPE7,
    UNUSED_TYPE8,
    UNUSED_TYPE9,
}

struct UserDataHistoryElement {
    1: optional string value,
    2: optional string oldValue,
    3: optional UserDataType userDataType,
    4: optional string userActivityType,
    5: optional string requester,
    6: optional string source,
    7: optional DateTime updatedAt,
}

struct GetUserDataHistoryRequest {
    1: optional UserDataType userDataType,
    2: optional string userActivityType,
    3: optional i32 pageSize = 10,
    4: optional string token,
}

struct GetUserDataHistoryResponse {
    1: optional list<UserDataHistoryElement> userDataHistory,
    2: optional string token,
}

struct GetUserSegmentRequest {
    1: required UUID userUUID
    2: required string domain
}

struct UpdateUserSegmentRequest {
    1: required UUID userUUID
    2: required string domain
    3: required string name  // name of the segment
    4: optional i32 version  // if not set will record the latest version of the domain
    5: optional bool ignoreIfExist  // If true, will not update the segment if the user already has a userSegment set for the domain
}

struct Headers {
    1: optional string acceptLanguage
    2: optional string xUberDeviceLanguage
    3: optional double xUberDeviceLocationLatitude
    4: optional double xUberDeviceLocationLongitude
    5: optional string xForwardedFor
}

/** Create base user request */
struct CreateBaseUserRequest {
    1: optional string tenancy
    3: optional string email
    4: optional bool hasConfirmedEmail
    5: optional string mobile
    6: optional string mobileCountryCode
    7: optional MobileConfirmationStatus mobileConfirmationStatus
    8: optional Headers headers
}

/** Engagement Tiers */
enum EngagementTier {
    UNKNOWN = 0,
    TIER_1,
    TIER_2,
    TIER_3,
    TIER_4,
    UNUSED_TYPE5,
    UNUSED_TYPE6,
    UNUSED_TYPE7,
    UNUSED_TYPE8,
    UNUSED_TYPE9,
    UNUSED_TYPE10,
}


/** Driver Engagement Statuses */
enum DriverEngagementStatus {
    NONE = 0,
    WARNING_QUALITY,
    SUSPENDED_QUALITY,
    UNUSED_TYPE3,
    UNUSED_TYPE4,
    UNUSED_TYPE5,
    UNUSED_TYPE6,
    UNUSED_TYPE7,
    UNUSED_TYPE8,
    UNUSED_TYPE9,
    UNUSED_TYPE10,
}

/** Courier Engagement Statuses */
enum CourierEngagementStatus {
    NONE = 0,
    WARNING_QUALITY,
    SUSPENDED_QUALITY,
    UNUSED_TYPE3,
    UNUSED_TYPE4,
    UNUSED_TYPE5,
    UNUSED_TYPE6,
    UNUSED_TYPE7,
    UNUSED_TYPE8,
    UNUSED_TYPE9,
    UNUSED_TYPE10,
}

/** Gender Types */
enum GenderType {
    MALE = 0,
    FEMALE,
    INDETERMINATE,
    OTHER,
    DECLINED,
    UNUSED_TYPE5,
    UNUSED_TYPE6,
    UNUSED_TYPE7,
    UNUSED_TYPE8,
    UNUSED_TYPE9,
    UNUSED_TYPE10,
}

/** Rider Engagement request */
struct RiderEngagementRequest {
    1: optional UUID userUuid
    2: optional RiderEngagement engagement
}

/** Driver Engagement request */
struct DriverEngagementRequest {
    1: optional UUID userUuid
    2: optional DriverEngagement engagement
}

/** Courier Engagement request */
struct CourierEngagementRequest {
    1: optional UUID userUuid
    2: optional CourierEngagement engagement
}

struct ChangeUserCityAndFlowTypeRequest {
    1: optional UUID userUuid
    2: optional i32 territoryId
    3: optional DriverFlowType flowType
}

struct ChangeUserCityAndFlowTypeResponse {
    1: optional string message
    2: optional bool success
    3: optional string type
}

struct UpdateLoginEligibilityRequest {
    1: optional bool denyLogin
    2: optional string denyLoginReason
}

/** User Service interface*/
service UserService
{
  /** Creates and returns newly created UserTag
   * Note: No tier 0/1 service should depend on existence of tags in their critical paths and should always treat tags
   * as optional read only properties.
   */
  UserTag createUserTag(
    /** user uuid */
    1: UUID userUuid,
    /** tag name */
    2: string name,
    3: string note,
    /** we try to deprecate this property, please use note if it's possible */
    4: list<string> notes
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "write", cerberus.qps = "600")

  /** deletes UserTag
   * Note: No tier 0/1 service should depend on existence of tags in their critical paths and should always treat tags
   * as optional read only properties.
   */
  void deleteUserTag(
    1: UUID userUuid,
    2: string tagName
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "write", cerberus.qps = "600")

  /** update UserTag for multiple users
   * Note: No tier 0/1 service should depend on existence of tags in their critical paths and should always treat tags
   * as optional read only properties.
   */
  void updateUserTagBulk(
    1: list<UUID> userUuids,
    /** tag name */
    2: string name,
    3: string note,
    /** we try to deprecate this property, please use note if it's possible */
    4: list<string> notes
  ) throws (
    1: ValidationError validationFailed,
    2: UserMissingArgument missingArgument,
    3: EntityNotFound notFound,
    4: InternalServerError serverError
    5: Unauthorized unauthorized,
  )

  /** Adds a trait to a user */
  UserTraitMap addUserTrait(
    1: UUID userUuid,
    2: UUID traitUuid /** trait uuid */
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
    4: UserMissingArgument missingArgument
  )

  /** Removes a trait from a user */
  void removeUserTrait(
    1: UUID userUuid,
    2: UUID traitUuid /** trait uuid */
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
    4: UserMissingArgument missingArgument
  )

  /** Gets a list of traits for a give user */
  list<UserTraitMap> getUserTraits(1: UUID userUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /* User's create, update, delete and export/import */

  /** Creates and returns a newly created user*/
  User createUser(1: User user) throws (
   1: EntityAlreadyExists alreadyExists,
   2: ValidationError validationFailed,
   3: Unauthorized unauthorized,
   4: UserMissingArgument missingArgument
   5: UserDataConstraintClientException dataConstraintError
  ) (cerberus.enabled = "true", cerberus.type = "write")

  /** Assign user types to a user */
  User assignUserTypes(
   1: UUID userUuid,
   2: list<UserType> userTypes,
  ) throws (
     1: EntityNotFound notFound,
     2: Unauthorized unauthorized,
     3: ValidationError validationFailed,
     4: InternalServerError serverError,
     5: UserDataConstraintClientException dataConstraintError
  )

  /** Remove user types to a user */
  User removeUserTypes(
   1: UUID userUuid,
   2: list<UserType> userTypes,
  ) throws (
     1: EntityNotFound notFound,
     2: Unauthorized unauthorized,
     3: ValidationError validationFailed,
     4: InternalServerError serverError,
     5: UserDataConstraintClientException dataConstraintError
  )

  /** Update fields owned by a basic user */
  User updateUserInfo(
   1: UUID userUuid,
   2: UpdateUserInfoRequest userFields
  ) throws (
     1: EntityNotFound notFound,
     2: Unauthorized unauthorized,
     3: ValidationError validationFailed,
     4: InternalServerError serverError,
     5: UserDataConstraintClientException dataConstraintError
  )

  /** Update driver specific info. */
  User updateDriverInfo(
   1: UUID userUuid,
   2: UpdateUserInfoRequest userFields,
   3: UpdateDriverInfoRequest driverFields,
  ) throws (
   1: EntityNotFound notFound,
   2: Unauthorized unauthorized,
   3: ValidationError validationFailed,
   4: InternalServerError internalError
  )

  /** Update partner specific info. */
  User updatePartnerInfo(
    1: UUID userUuid,
    2: UpdateUserInfoRequest userFields,
    3: UpdateDriverInfoRequest driverFields,
    4: UpdatePartnerInfoRequest partnerFields
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError internalError
  )

  /** Update freight specific info. */
  User updateFreightInfo(
    1: UUID userUuid,
    2: UpdateFreightInfoRequest freightFields,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError internalError
  )

  /** Deletes user */
  void deleteUser(1: UUID userUuid, 2: string note) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError serverError
  )

  /** Sets requested_deletion_at and unsubscribes from comms */
  void markUserForDeletion(1: UUID userUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError serverError
  )
    /** Sets requested_deletion_at to null and resubscribes to comms */
  void unmarkUserForDeletion(1: UUID userUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError serverError
  )

  void scrubUser(1: UUID userUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError serverError
  )

  /** Delete test tenancy user */
  void deleteUserTestTenancy(1: UUID userUuid, 2: string note) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError serverError
  )

  /** Create/Update user picture */
  User updateUserPicture(
    1: UUID userUuid,
    2: UserPicture userPicture
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: EntityAlreadyExists alreadyExists
  )

  /** Deletes user picture */
  User deleteUserPicture(
    1: UUID userUuid
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Set user contactinfo to empty string */
  void deleteDriverContactInfo(
    1: UUID userUuid
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /**Sets the list of alternate emails */
  void setAlternateEmails(
    1: UUID userUuid,
    2: list<UserEmail> emails
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
    4: UserMissingArgument missingArgument
    5: UserDataConstraintClientException dataConstraintError
  )

  /** Confirms/Unconfirms alternate email address */
  void setConfirmAlternateEmail(
    1: UUID userUuid,
    2: string email,
    3: bool isConfirmed,
    4: string emailToken
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
  )

  /** Confirms/Unconfirms primary email address */
  User setConfirmEmail(
    1: UUID userUuid,
    2: string emailToken
    3: bool isConfirmed
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
    4: InternalServerError internalError
  )

  /** Set a user's token */
  User setToken(
    1: UUID userUuid,
    2: string token
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
    4: InternalServerError internalError
  )

  /** Set a user's email token */
  User setEmailToken(
    1: UUID userUuid,
    2: string emailToken
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
    4: InternalServerError internalError
  )

  /* UserNote's create, update, delete */

  /** Creates and returns user note */
  UserNote createUserNote(
    1: UUID userUuid,
    2: string note,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
    4: InternalServerError internalError
  )

  /** Deletes user note */
  void deleteUserNote(
    1: UUID userUuid,
    2: i32 noteId /** sequence id of note creation */
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: UserMissingArgument missingArgument
  )


  /* UserAttribute's create, update, delete */

  /**Updates and returns updated user attribute*/
  UserAttribute updateUserAttribute(
    1: UUID   userUuid,
    2: string key,
    3: string value
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Deletes user attribute */
  void deleteUserAttribute(
    1: UUID userUuid,
    2: string key
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /* PaymentProfileView update, delete */

  /** Updates a list of payment profile views for a user */
  void setPaymentProfileViews(
    1: UUID userUuid,
    2: list<PaymentProfileView> paymentProfileViews
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Deletes payment profile view from a list for a user*/
  void deletePaymentProfileView(
    1: UUID userUuid,
    2: UUID paymentProfileUuid /* random (unsharded) uuid */
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: UserMissingArgument missingArgument
  )

  /* ThirdPartyIdentity create, update, delete */

  /** Creates and returns third party identity */
  ThirdPartyIdentity createThirdPartyIdentity(
    1: UUID userUuid,
    2: CreateThirdPartyIdentityFields tpiFields
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: UserMissingArgument missingArgument,
    6: UserDataConstraintClientException dataConstraintError,
    7: ThirdPartyAPIError tpiError
  )

  /**Updates and returns thrid party identity */
  ThirdPartyIdentity updateThirdPartyIdentity(
    1: UUID userUuid,
    2: UpdateThirdPartyIdentityFields identityFields,
    3: ThirdPartyIdentityType identityType
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: UserMissingArgument missingArgument
    6: UserDataConstraintClientException dataConstraintError
  )

  /** Deletes thrid party identity */
  void deleteThirdPartyIdentity(
    1: UUID userUuid,
    2: ThirdPartyIdentityType identityType
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: UserMissingArgument missingArgument
  )


  /* TraitType create, delete */

  /** Creates a new trait type */
  void createTraitType(
    1: UUID traitUuid,
    2: string name,
    3: string description
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: UserMissingArgument missingArgument,
    4: InternalServerError serverError,
    5: ValidationError validationFailed
  )

  /** Deletes a trait type */
  void deleteTraitType(1: UUID traitUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: UserMissingArgument missingArgument,
    4: InternalServerError serverError,
    5: ValidationError validationFailed
  )

  /* Some business logic goes here */

  /** Unbans user */
  User unbanUser(
    1: UUID userUuid,
    /** a tag we set when we unban the user */
    2: string additionalTag,
    3: string note
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Bans user */
  User banUser(
    1: UUID userUuid,
    /** a tag name we set when we ban the user */
    2: string additionalTag,
    3: string note
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Changes the role back to a previously taken role */
  User reinstateRole(
    1: UUID userUuid,
    2: UserRole newRole
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Changes a role for a user to either driver (DriverInfo required)
     or partner (PartnerInfo) or (DriverInfo if upgrading from a client)
     is required*/
  User changeRole(
    1: UUID userUuid,
    2: ChangeRoleRequest changeRoleRequest
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: UserDataConstraintClientException dataConstraintError,
  )

  /** Changes a partner for a given driver */
  User changeDriversPartner(
    1: UUID driverUuid,
    2: UUID partnerUuid
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Force token and email token reset */
  void forceTokenAndEmailTokenReset(
    1: UUID userUuid
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /* Read endpoints */

  /** Gets a user by uuid */
  User getUser(1: UUID userUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** temp endpoint for testing global caching, will be removed */
  CompleteUser getCompleteUser(1: UUID userUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Gets a list of users by their respective uuids */
  list<User> getUsers(1: list<UUID> userUuids) throws (
    1: Unauthorized unauthorized,
    2: InternalServerError serverError,
    3: ValidationError validationFailed,
    4: EntityNotFound notFound
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a user with all the tag names exist in input list */
  UserWithTagNames getUserWithTagNames(1: UUID userUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** get simple derived frields by uuid */
  DerivedFields getDerivedFields(
    1: UUID userUuid
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** get extended derived frields by uuid */
  ExtendedDerivedFields getExtendedDerivedFields(
    1: UUID userUuid,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** get ExtendedUser by uuid and a bit-vector-like selection object to specify what fields to
  retrieve */
  ExtendedUser getExtendedUser(
    1: UUID userUuid,
    2: RequestedFields requestedFields
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: UserMissingArgument missingArgument
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** get full picture url of a user*/
  string getFullPictureUrl(
    1: UUID userUuid
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a user by token */
  User getUserByToken(1: string token) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a user by email */
  User getUserByEmail(1: string email) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a user by promotion cide */
  User getUserByPromotionCode(1: string promotionCode) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a user by mobile number that should include a
   phone country code */
  User getUserByFullMobile(
    1: string mobile
  ) throws (
    1: EntityNotFound notFound,
    2: UserMissingArgument missingArgument,
    3: Unauthorized unauthorized,
    4: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a user by mobile number that doesn't
     include a country code */
  User getUserByMobileAndCountryCode(
    1: string nationalNumber,  /** local country phone number*/
    2: string countryCode      /** country code */
  ) throws (
    1: EntityNotFound notFound,
    2: UserMissingArgument missingArgument,
    3: Unauthorized unauthorized,
    4: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a user by twillio number */
  User getUserByTwilioNumber(1: string twilioNumber) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a user by nickname */
  User getUserByNickname(1: string nickname) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a user by third party identity user id */
  User getUserByThirdPartyIdentity(
    1: ThirdPartyIdentityType identityType,
    2: string thirdPartyUserId
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a user by third party identity access token */
  User getUserByTPIAccessToken(
    1: GetUserByTPIAccessTokenFields fields
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: ThirdPartyAPIError tpiError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a user by email token */
  User getUserByEmailToken(1: string emailToken) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a list of alternate emails for a user */
  list<UserEmail> getAlternateEmails(1: UUID userUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Get one or multiple user addresses by user address type */
  map<UUID, Address> getAddressesByType(
    1: UUID userUuid,
    2: AddressType addressType,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets all the addresses for a user */
  map<UUID, Address> getAddresses(
    1: UUID userUuid,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Creates and returns created user address */
  Address createAddress(
    1: UUID userUuid,
    2: AddressInfo addressInfo,
    3: AddressType addressType,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Updates and returns updated user address */
  Address updateAddress(
    1: UUID userUuid,
    2: UUID addressUuid,
    3: AddressInfo addressInfo,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Deletes user address */
  void deleteAddress(
    1: UUID userUuid,
    2: UUID addressUuid,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Gets a list of user attributes for a user */
  map<string, UserAttribute> getUserAttributes(1: UUID userUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** TO BE DEPRECATED, PLEASE USE getUserAttributeByKeys instead */
  UserAttribute getUserAttributeByKey(1: UUID userUuid, 2: string key) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Get the value of multiple user attributes by keys for a user */
  map<string, UserAttribute> getUserAttributeByKeys(
    1: required UUID userUuid,
    2: required list<string> keys
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a list of user notes for a user */
  list<UserNote> getUserNotes(1: UUID userUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a list of user tags for a user
   * Note: No tier 0/1 service should depend on existence of tags in their critical paths and should always treat tags
   * as optional read only properties.
   */
  map<string, UserTag> getUserTags(
    1: UUID userUuid,
    2: bool activeOnly /* returns non deleted user tags only if true */
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /*
   * Note: No tier 0/1 service should depend on existence of tags in their critical paths and should always treat tags
   * as optional read only properties.
   */
  UserTag getUserTag(1: UUID userUuid, 2: string tag) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Check the existence of a list of user tags for a user. Return the tags in the given input that the user has.
   * Note: No tier 0/1 service should depend on existence of tags in their critical paths and should always treat tags
   * as optional read only properties.
   */
  set<string> hasUserTags(
    1: UUID userUuid,
    2: list<string> names   /** a list of tag names */
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Check a user's role (CLIENT, DRIVER, PARTNER) and tags relate to his/her admin status. */
   UserRoleInfo getUserRoleInfo(
    1: UUID userUuid
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets tenancy for a user */
  string getUserTenancy(
    1: UUID userUuid
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a full list of drivers for a given partner */
  list<User> getPartnerDrivers(1: UUID partnerUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets paging list of drivers for a given partner */
  PartnerDriversPagingResult getPartnerDriversPagingResult(
    1: required UUID partnerUuid
    2: SearchPagingInfo pagingInfo
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a list of drivers for a given contact info */
  list<User> getDriversByContactInfo(
    1: string nationalNumber,  /** local country phone number*/
    2: string countryCode      /** country code */
  ) throws (
    1: EntityNotFound notFound,
    2: UserMissingArgument missingArgument,
    3: ValidationError validationFailed,
    4: Unauthorized unauthorized
    5: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a list of user third party identities for a user */
  list<ThirdPartyIdentity> getThirdPartyIdentities(1: UUID userUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Refresh token for a third party identity */
  ThirdPartyIdentity refreshThirdPartyIdentityToken(
    1: UUID userUuid,
    2: ThirdPartyIdentityType identityType
    ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: ThirdPartyAPIError tpiError
  )

  /** Gets a list of user payment profile views for a user */
  list<PaymentProfileView> getPaymentProfileViews(1: UUID userUuid) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Gets a list of all trait types */
  map<UUID, UserTrait> getAllTraitTypes() throws (
    1: Unauthorized unauthorized,
    2: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Get timestamp of the last oauth application revoke action.*/
  DateTime getAppRevokedTime(
    1: UUID userUuid,
    2: string oauthAppId
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Revoke an oauth application for the user.*/
  void setAppRevoked(
    1: UUID userUuid,
    2: string oauthAppId
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
  )

  /* User Profile CRUD */

  /** Create a user profile */
  UserProfile createUserProfile(
    1: required UUID userUuid,
    2: UserProfile userProfile
  ) throws (
    1: EntityAlreadyExists alreadyExists,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: UserMissingArgument missingArgument,
    6: EntityNotFound notFound
  )

  /** Get all user profiles by user UUID */
  list<UserProfile> getUserProfiles(
    1: required UUID userUuid,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Get all user profiles by user UUID */
  list<UserProfile> getUserProfilesWithDeletedProfiles(
    1: required UUID userUuid,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /**
   * Update a profile for the given user.
   */
  UserProfile updateUserProfile(
    1: required UUID userUuid,
    2: required UserProfile userProfile,
  ) throws (
    1: EntityNotFound notfound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: UserMissingArgument missingArgument
  )

  /** Delete a user profile */
  void deleteUserProfile(
    1: required UUID userUuid,
    2: required UUID profileUuid,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Get driver statuses */
  list<DriverStatusEntity> getDriverStatuses(
    1: required UUID userUuid
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Update driver status */
  User updateDriverStatusWithEntity(
    1: UUID userUuid,
    2: UpdateDriverStatusRequest updateDriverStatusRequest
  ) throws (

    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Update driver flow type */
  User setDriverFlowType(
    1: required UUID driverUuid,
    2: required DriverFlowType driverFlowType
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed
  )

  /** Set mobile confirm status */
  User setMobileConfirmationStatus(
    1: UUID userUuid,
    2: MobileConfirmationStatus status,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError internalError,
    5: UserDataConstraintClientException dataConstraintError
  )

  /** Set client mobile confirmation status */
  User setClientMobileConfirmationStatus(
    1: UUID userUuid,
    2: SetClientMobileConfirmationStatusRequest setClientMobileConfirmationStatusRequest
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError internalError
    5: AccountMissingMobileNumber accountMissingMobileNumber
  )

  /** Set mobile token */
  User setMobileToken(
    1: UUID userUuid,
    2: i32 mobileToken
  ) throws (
   1: EntityNotFound notFound,
   2: Unauthorized unauthorized,
   3: ValidationError validationFailed,
   4: InternalServerError internalError
  )

  /** Update a referral code */
  User setReferralCode(
    1: UUID userUuid,
    2: string referralCode,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError internalError
  )

  /** Update user's inviter uuid */
  User setInviterUuid(
    1: UUID userUuid,
    2: UUID inviterUuid,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError internalError
  )

  /** Update a user's national ID.

   This is currently only used in Spain to comply with regulatory requirements. However,
   it can be extended to support other identification id types. */
  User updateNationalId(
    1: required UUID userUuid,
    2: required UpdateNationalIdRequest request,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
  )

  /** Update first trip uuid for driver */
  User setFirstDriverTripUuid(
    1: UUID userUuid,
    2: UUID firstTripUuid
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError internalError
  )

  /** Update first trip uuid for partner */
  User setFirstPartnerTripUuid(
    1: UUID userUuid,
    2: UUID firstTripUuid
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError internalError
  )

  /** Update the recent fare splitter uuids for given user */
  User setRecentFareSplitterUuids(
    1: UUID userUuid,
    2: list<UUID> recentFareSplitterUuids
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError internalError
  )


  /*
   * Gets the user data history for a specific given type (UserDataType)
   * If UserDataType is set to PROFILE_PHOTO, the value returned will be under the form of a signed URL
  */
  GetUserDataHistoryResponse getUserDataHistory(
    1: UUID userUuid,
    2: GetUserDataHistoryRequest request,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError internalError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /*
   * Gets a user's segment. If a user does not have segment assigned
   * in a given domain, there will not be an error and the response will be nil.
  */
  UserSegment getUserSegment(
    1: GetUserSegmentRequest request,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /* Sets a user's segment */
  void updateUserSegment(
    1: UpdateUserSegmentRequest request,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError serverError
  )

  /* MarketingAttributedEvent create, read, update and delete */

  /** Add marketing attributed event */
  MarketingAttributedEvent createMarketingAttributedEvent(
    1: UUID userUuid,
    2: MarketingAttributedEvent marketingAttributedEvent,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: UserMissingArgument missingArgument,
    6: UserDataConstraintClientException dataConstraintError,
  )

  /** Returns marketing attributed event */
  list<MarketingAttributedEvent> getMarketingAttributedEvents(
    1: UUID userUuid,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: UserMissingArgument missingArgument,
  ) (cerberus.enabled = "true", cerberus.type = "read")

  /** Update marketing attributed event */
  void updateMarketingAttributedEvent(
    1: UpdateMarketingAttributedEventRequest request,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: UserMissingArgument missingArgument,
  )

  /** Deletes marketing attribution event */
  void deleteMarketingAttributedEvent(
    1: UUID userUuid,
    2: MarketingAttributedEventSelector selector,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: InternalServerError serverError,
    4: ValidationError validationFailed,
    5: UserMissingArgument missingArgument,
    6: UserDataConstraintClientException dataConstraintError,
  )

  /** Creates and returns a newly created base user */
  User createBaseUser(
    1: CreateBaseUserRequest request
  ) throws (
    1: Unauthorized unauthorized,
    2: ValidationError validationFailed,
    3: UserMissingArgument missingArgument,
    4: UserDataConstraintClientException dataConstraintError,
  ) (cerberus.enabled = "true", cerberus.type = "write")

  /** Update fraud actions info. */
  User updateFraudActions(
    1: UUID userUuid,
    2: UpdateFraudActionsRequest fraudActions,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError internalError
  ) (cerberus.enabled = "true", cerberus.type = "write")

  /** Update status lock info. */
  User updateStatusLocks(
    1: UUID userUuid,
    2: UpdateStatusLocksRequest statusLocks,
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed,
    4: InternalServerError internalError
  ) (cerberus.enabled = "true", cerberus.type = "write")

  /** Releases a mobile from any existing user account.
      Returns the user whose mobile number was updated.
  */
  UUID releaseMobileNumber(
    1: ReleaseMobileNumberRequest releaseMobileNumberRequest
  ) throws (
    1: EntityNotFound notFound,
    2: UserMissingArgument missingArgument,
    3: Unauthorized unauthorized,
    4: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "write")

  /** Update rider engagement info */
  void updateRiderEngagement(
    1: RiderEngagementRequest riderEngagementRequest
  ) throws (
    1: EntityNotFound notFound,
    2: UserMissingArgument missingArgument,
    3: Unauthorized unauthorized,
    4: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "write")

  /** Update driver engagement info */
  void updateDriverEngagement(
    1: DriverEngagementRequest driverEngagementRequest
  ) throws (
    1: EntityNotFound notFound,
    2: UserMissingArgument missingArgument,
    3: Unauthorized unauthorized,
    4: InternalServerError serverError
  ) (cerberus.enabled = "true", cerberus.type = "write")
  
  /** Update courier engagement info */
    void updateCourierEngagement(
      1: CourierEngagementRequest courierEngagementRequest
    ) throws (
      1: EntityNotFound notFound,
      2: UserMissingArgument missingArgument,
      3: Unauthorized unauthorized,
      4: InternalServerError serverError
    ) (cerberus.enabled = "true", cerberus.type = "write")

  /** Changes a user's city and flow type */
  list<ChangeUserCityAndFlowTypeResponse> changeUserCityAndFlowType(
    1: ChangeUserCityAndFlowTypeRequest changeUserCityAndFlowTypeRequest
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
    4: InternalServerError internalError
  ) (cerberus.enabled = "true", cerberus.type = "write")

  /** Updates the loginEligibility struct */
  User updateLoginEligibility(
    1: UUID userUuid
    2: UpdateLoginEligibilityRequest updateLoginEligibilityRequest
  ) throws (
    1: EntityNotFound notFound,
    2: Unauthorized unauthorized,
    3: ValidationError validationFailed
    4: InternalServerError internalError
  ) (cerberus.enabled = "true", cerberus.type = "write")
}


// Uber's internal TChan health check protocol.

struct HealthStatus {
  1: required bool ok
  2: optional string message
}

struct FlameOptions {
  1: required i32 durationSeconds,
  2: optional string endpoint,
  3: optional i32 minLatencyMS,
  4: optional i32 maxLatencyMS,
}

service Meta {
    HealthStatus health()
    string thriftIDL()
    string profile(1: i32 seconds)
    string flame(1: FlameOptions options)
}
