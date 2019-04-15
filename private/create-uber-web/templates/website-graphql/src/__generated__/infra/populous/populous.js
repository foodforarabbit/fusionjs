// @flow

/* istanbul ignore file */
// @generated
import type {UserService} from './populous.flow.js';
import util from 'util';

export function createUserService(
  atreyu: any,
  tracer: any,
  logger: any,
  serviceName: string
): UserService {
  const reqs = {};

  function log(err: Error, method: string) {
    const _err = err;

    if (!_err.message) {
      _err.message = method + ' request failed';
    }

    logger.error(
      _err.message,
      util.inspect(_err, {
        depth: 2,
      })
    );
  }

  async function makeRequest(
    service,
    methodName,
    args,
    seed,
    ctx,
    gqlInfo,
    options = {}
  ) {
    const span = tracer && tracer.from(ctx).span;
    const method = service + '::' + methodName;
    let request = reqs[method];

    if (!request) {
      request = atreyu.createRequest(
        {
          service: serviceName,
          method,
          args,
        },
        {
          name: (service + '_' + methodName).toLowerCase(),
        }
      );
      reqs[method] = request;
    }

    return new Promise((resolve, reject) => {
      try {
        request.resolve(
          seed,
          (err, data) => {
            if (err) {
              log(err, method);
              return reject(err);
            }

            return resolve(data);
          },
          {
            ...options,
            tracing: {
              span,
            },
          }
        );
      } catch (err) {
        log(err, method);
        return reject(err);
      }
    });
  }

  return (({
    createUserTag(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        name: '{data.name}',
        note: '{data.note}',
        notes: '{data.notes}',
      };
      return makeRequest(
        'UserService',
        'createUserTag',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deleteUserTag(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        tagName: '{data.tagName}',
      };
      return makeRequest(
        'UserService',
        'deleteUserTag',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateUserTagBulk(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuids: '{data.userUuids}',
        name: '{data.name}',
        note: '{data.note}',
        notes: '{data.notes}',
      };
      return makeRequest(
        'UserService',
        'updateUserTagBulk',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    addUserTrait(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        traitUuid: '{data.traitUuid}',
      };
      return makeRequest(
        'UserService',
        'addUserTrait',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    removeUserTrait(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        traitUuid: '{data.traitUuid}',
      };
      return makeRequest(
        'UserService',
        'removeUserTrait',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserTraits(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getUserTraits',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    createUser(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        user: '{data.user}',
      };
      return makeRequest(
        'UserService',
        'createUser',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    assignUserTypes(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        userTypes: '{data.userTypes}',
      };
      return makeRequest(
        'UserService',
        'assignUserTypes',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    removeUserTypes(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        userTypes: '{data.userTypes}',
      };
      return makeRequest(
        'UserService',
        'removeUserTypes',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateUserInfo(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        userFields: '{data.userFields}',
      };
      return makeRequest(
        'UserService',
        'updateUserInfo',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateDriverInfo(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        userFields: '{data.userFields}',
        driverFields: '{data.driverFields}',
      };
      return makeRequest(
        'UserService',
        'updateDriverInfo',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updatePartnerInfo(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        userFields: '{data.userFields}',
        driverFields: '{data.driverFields}',
        partnerFields: '{data.partnerFields}',
      };
      return makeRequest(
        'UserService',
        'updatePartnerInfo',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateFreightInfo(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        freightFields: '{data.freightFields}',
      };
      return makeRequest(
        'UserService',
        'updateFreightInfo',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deleteUser(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        note: '{data.note}',
      };
      return makeRequest(
        'UserService',
        'deleteUser',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    markUserForDeletion(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'markUserForDeletion',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    unmarkUserForDeletion(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'unmarkUserForDeletion',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    scrubUser(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'scrubUser',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deleteUserTestTenancy(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        note: '{data.note}',
      };
      return makeRequest(
        'UserService',
        'deleteUserTestTenancy',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateUserPicture(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        userPicture: '{data.userPicture}',
      };
      return makeRequest(
        'UserService',
        'updateUserPicture',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deleteUserPicture(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'deleteUserPicture',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deleteDriverContactInfo(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'deleteDriverContactInfo',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setAlternateEmails(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        emails: '{data.emails}',
      };
      return makeRequest(
        'UserService',
        'setAlternateEmails',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setConfirmAlternateEmail(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        email: '{data.email}',
        isConfirmed: '{data.isConfirmed}',
        emailToken: '{data.emailToken}',
      };
      return makeRequest(
        'UserService',
        'setConfirmAlternateEmail',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setConfirmEmail(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        emailToken: '{data.emailToken}',
        isConfirmed: '{data.isConfirmed}',
      };
      return makeRequest(
        'UserService',
        'setConfirmEmail',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setToken(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        token: '{data.token}',
      };
      return makeRequest(
        'UserService',
        'setToken',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setEmailToken(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        emailToken: '{data.emailToken}',
      };
      return makeRequest(
        'UserService',
        'setEmailToken',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    createUserNote(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        note: '{data.note}',
      };
      return makeRequest(
        'UserService',
        'createUserNote',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deleteUserNote(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        noteId: '{data.noteId}',
      };
      return makeRequest(
        'UserService',
        'deleteUserNote',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateUserAttribute(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        key: '{data.key}',
        value: '{data.value}',
      };
      return makeRequest(
        'UserService',
        'updateUserAttribute',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deleteUserAttribute(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        key: '{data.key}',
      };
      return makeRequest(
        'UserService',
        'deleteUserAttribute',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setPaymentProfileViews(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        paymentProfileViews: '{data.paymentProfileViews}',
      };
      return makeRequest(
        'UserService',
        'setPaymentProfileViews',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deletePaymentProfileView(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        paymentProfileUuid: '{data.paymentProfileUuid}',
      };
      return makeRequest(
        'UserService',
        'deletePaymentProfileView',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    createThirdPartyIdentity(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        tpiFields: '{data.tpiFields}',
      };
      return makeRequest(
        'UserService',
        'createThirdPartyIdentity',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateThirdPartyIdentity(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        identityFields: '{data.identityFields}',
        identityType: '{data.identityType}',
      };
      return makeRequest(
        'UserService',
        'updateThirdPartyIdentity',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deleteThirdPartyIdentity(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        identityType: '{data.identityType}',
      };
      return makeRequest(
        'UserService',
        'deleteThirdPartyIdentity',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    createTraitType(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        traitUuid: '{data.traitUuid}',
        name: '{data.name}',
        description: '{data.description}',
      };
      return makeRequest(
        'UserService',
        'createTraitType',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deleteTraitType(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        traitUuid: '{data.traitUuid}',
      };
      return makeRequest(
        'UserService',
        'deleteTraitType',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    unbanUser(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        additionalTag: '{data.additionalTag}',
        note: '{data.note}',
      };
      return makeRequest(
        'UserService',
        'unbanUser',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    banUser(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        additionalTag: '{data.additionalTag}',
        note: '{data.note}',
      };
      return makeRequest(
        'UserService',
        'banUser',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    reinstateRole(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        newRole: '{data.newRole}',
      };
      return makeRequest(
        'UserService',
        'reinstateRole',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    changeRole(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        changeRoleRequest: '{data.changeRoleRequest}',
      };
      return makeRequest(
        'UserService',
        'changeRole',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    changeDriversPartner(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        driverUuid: '{data.driverUuid}',
        partnerUuid: '{data.partnerUuid}',
      };
      return makeRequest(
        'UserService',
        'changeDriversPartner',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    forceTokenAndEmailTokenReset(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'forceTokenAndEmailTokenReset',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUser(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getUser',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getCompleteUser(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getCompleteUser',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUsers(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuids: '{data.userUuids}',
      };
      return makeRequest(
        'UserService',
        'getUsers',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserWithTagNames(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getUserWithTagNames',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getDerivedFields(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getDerivedFields',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getExtendedDerivedFields(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getExtendedDerivedFields',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getExtendedUser(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        requestedFields: '{data.requestedFields}',
      };
      return makeRequest(
        'UserService',
        'getExtendedUser',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getFullPictureUrl(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getFullPictureUrl',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserByToken(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        token: '{data.token}',
      };
      return makeRequest(
        'UserService',
        'getUserByToken',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserByEmail(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        email: '{data.email}',
      };
      return makeRequest(
        'UserService',
        'getUserByEmail',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserByPromotionCode(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        promotionCode: '{data.promotionCode}',
      };
      return makeRequest(
        'UserService',
        'getUserByPromotionCode',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserByFullMobile(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        mobile: '{data.mobile}',
      };
      return makeRequest(
        'UserService',
        'getUserByFullMobile',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserByMobileAndCountryCode(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        nationalNumber: '{data.nationalNumber}',
        countryCode: '{data.countryCode}',
      };
      return makeRequest(
        'UserService',
        'getUserByMobileAndCountryCode',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserByTwilioNumber(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        twilioNumber: '{data.twilioNumber}',
      };
      return makeRequest(
        'UserService',
        'getUserByTwilioNumber',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserByNickname(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        nickname: '{data.nickname}',
      };
      return makeRequest(
        'UserService',
        'getUserByNickname',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserByThirdPartyIdentity(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        identityType: '{data.identityType}',
        thirdPartyUserId: '{data.thirdPartyUserId}',
      };
      return makeRequest(
        'UserService',
        'getUserByThirdPartyIdentity',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserByTPIAccessToken(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        fields: '{data.fields}',
      };
      return makeRequest(
        'UserService',
        'getUserByTPIAccessToken',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserByEmailToken(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        emailToken: '{data.emailToken}',
      };
      return makeRequest(
        'UserService',
        'getUserByEmailToken',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getAlternateEmails(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getAlternateEmails',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getAddressesByType(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        addressType: '{data.addressType}',
      };
      return makeRequest(
        'UserService',
        'getAddressesByType',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getAddresses(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getAddresses',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    createAddress(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        addressInfo: '{data.addressInfo}',
        addressType: '{data.addressType}',
      };
      return makeRequest(
        'UserService',
        'createAddress',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateAddress(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        addressUuid: '{data.addressUuid}',
        addressInfo: '{data.addressInfo}',
      };
      return makeRequest(
        'UserService',
        'updateAddress',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deleteAddress(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        addressUuid: '{data.addressUuid}',
      };
      return makeRequest(
        'UserService',
        'deleteAddress',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserAttributes(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getUserAttributes',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserAttributeByKey(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        key: '{data.key}',
      };
      return makeRequest(
        'UserService',
        'getUserAttributeByKey',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserAttributeByKeys(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        keys: '{data.keys}',
      };
      return makeRequest(
        'UserService',
        'getUserAttributeByKeys',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserNotes(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getUserNotes',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserTags(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        activeOnly: '{data.activeOnly}',
      };
      return makeRequest(
        'UserService',
        'getUserTags',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserTag(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        tag: '{data.tag}',
      };
      return makeRequest(
        'UserService',
        'getUserTag',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    hasUserTags(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        names: '{data.names}',
      };
      return makeRequest(
        'UserService',
        'hasUserTags',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserRoleInfo(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getUserRoleInfo',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserTenancy(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getUserTenancy',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getPartnerDrivers(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        partnerUuid: '{data.partnerUuid}',
      };
      return makeRequest(
        'UserService',
        'getPartnerDrivers',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getPartnerDriversPagingResult(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        partnerUuid: '{data.partnerUuid}',
        pagingInfo: '{data.pagingInfo}',
      };
      return makeRequest(
        'UserService',
        'getPartnerDriversPagingResult',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getDriversByContactInfo(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        nationalNumber: '{data.nationalNumber}',
        countryCode: '{data.countryCode}',
      };
      return makeRequest(
        'UserService',
        'getDriversByContactInfo',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getThirdPartyIdentities(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getThirdPartyIdentities',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    refreshThirdPartyIdentityToken(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        identityType: '{data.identityType}',
      };
      return makeRequest(
        'UserService',
        'refreshThirdPartyIdentityToken',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getPaymentProfileViews(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getPaymentProfileViews',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getAllTraitTypes(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {};
      return makeRequest(
        'UserService',
        'getAllTraitTypes',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getAppRevokedTime(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        oauthAppId: '{data.oauthAppId}',
      };
      return makeRequest(
        'UserService',
        'getAppRevokedTime',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setAppRevoked(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        oauthAppId: '{data.oauthAppId}',
      };
      return makeRequest(
        'UserService',
        'setAppRevoked',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    createUserProfile(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        userProfile: '{data.userProfile}',
      };
      return makeRequest(
        'UserService',
        'createUserProfile',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserProfiles(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getUserProfiles',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserProfilesWithDeletedProfiles(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getUserProfilesWithDeletedProfiles',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateUserProfile(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        userProfile: '{data.userProfile}',
      };
      return makeRequest(
        'UserService',
        'updateUserProfile',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deleteUserProfile(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        profileUuid: '{data.profileUuid}',
      };
      return makeRequest(
        'UserService',
        'deleteUserProfile',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getDriverStatuses(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getDriverStatuses',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateDriverStatusWithEntity(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        updateDriverStatusRequest: '{data.updateDriverStatusRequest}',
      };
      return makeRequest(
        'UserService',
        'updateDriverStatusWithEntity',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setDriverFlowType(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        driverUuid: '{data.driverUuid}',
        driverFlowType: '{data.driverFlowType}',
      };
      return makeRequest(
        'UserService',
        'setDriverFlowType',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setMobileConfirmationStatus(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        status: '{data.status}',
      };
      return makeRequest(
        'UserService',
        'setMobileConfirmationStatus',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setClientMobileConfirmationStatus(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        setClientMobileConfirmationStatusRequest:
          '{data.setClientMobileConfirmationStatusRequest}',
      };
      return makeRequest(
        'UserService',
        'setClientMobileConfirmationStatus',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setMobileToken(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        mobileToken: '{data.mobileToken}',
      };
      return makeRequest(
        'UserService',
        'setMobileToken',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setReferralCode(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        referralCode: '{data.referralCode}',
      };
      return makeRequest(
        'UserService',
        'setReferralCode',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setInviterUuid(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        inviterUuid: '{data.inviterUuid}',
      };
      return makeRequest(
        'UserService',
        'setInviterUuid',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateNationalId(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        request: '{data.request}',
      };
      return makeRequest(
        'UserService',
        'updateNationalId',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setFirstDriverTripUuid(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        firstTripUuid: '{data.firstTripUuid}',
      };
      return makeRequest(
        'UserService',
        'setFirstDriverTripUuid',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setFirstPartnerTripUuid(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        firstTripUuid: '{data.firstTripUuid}',
      };
      return makeRequest(
        'UserService',
        'setFirstPartnerTripUuid',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    setRecentFareSplitterUuids(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        recentFareSplitterUuids: '{data.recentFareSplitterUuids}',
      };
      return makeRequest(
        'UserService',
        'setRecentFareSplitterUuids',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserDataHistory(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        request: '{data.request}',
      };
      return makeRequest(
        'UserService',
        'getUserDataHistory',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getUserSegment(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        request: '{data.request}',
      };
      return makeRequest(
        'UserService',
        'getUserSegment',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateUserSegment(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        request: '{data.request}',
      };
      return makeRequest(
        'UserService',
        'updateUserSegment',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    createMarketingAttributedEvent(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        marketingAttributedEvent: '{data.marketingAttributedEvent}',
      };
      return makeRequest(
        'UserService',
        'createMarketingAttributedEvent',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    getMarketingAttributedEvents(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
      };
      return makeRequest(
        'UserService',
        'getMarketingAttributedEvents',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateMarketingAttributedEvent(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        request: '{data.request}',
      };
      return makeRequest(
        'UserService',
        'updateMarketingAttributedEvent',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    deleteMarketingAttributedEvent(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        selector: '{data.selector}',
      };
      return makeRequest(
        'UserService',
        'deleteMarketingAttributedEvent',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    createBaseUser(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        request: '{data.request}',
      };
      return makeRequest(
        'UserService',
        'createBaseUser',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateFraudActions(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        fraudActions: '{data.fraudActions}',
      };
      return makeRequest(
        'UserService',
        'updateFraudActions',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateStatusLocks(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        statusLocks: '{data.statusLocks}',
      };
      return makeRequest(
        'UserService',
        'updateStatusLocks',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    releaseMobileNumber(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        releaseMobileNumberRequest: '{data.releaseMobileNumberRequest}',
      };
      return makeRequest(
        'UserService',
        'releaseMobileNumber',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateRiderEngagement(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        riderEngagementRequest: '{data.riderEngagementRequest}',
      };
      return makeRequest(
        'UserService',
        'updateRiderEngagement',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateDriverEngagement(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        driverEngagementRequest: '{data.driverEngagementRequest}',
      };
      return makeRequest(
        'UserService',
        'updateDriverEngagement',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateCourierEngagement(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        courierEngagementRequest: '{data.courierEngagementRequest}',
      };
      return makeRequest(
        'UserService',
        'updateCourierEngagement',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    changeUserCityAndFlowType(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        changeUserCityAndFlowTypeRequest:
          '{data.changeUserCityAndFlowTypeRequest}',
      };
      return makeRequest(
        'UserService',
        'changeUserCityAndFlowType',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },

    updateLoginEligibility(seed, ctx, gqlInfo, options) {
      const atreyuArgs = {
        userUuid: '{data.userUuid}',
        updateLoginEligibilityRequest: '{data.updateLoginEligibilityRequest}',
      };
      return makeRequest(
        'UserService',
        'updateLoginEligibility',
        atreyuArgs,
        seed,
        ctx,
        gqlInfo,
        options
      );
    },
  }: any): UserService);
}
