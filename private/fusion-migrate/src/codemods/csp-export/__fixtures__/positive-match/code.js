import SecureHeaders, {
  SecureHeadersToken,
  SecureHeadersCSPConfigToken,
} from '@uber/fusion-plugin-secure-headers';
import secureHeadersConfig from './config/secure-headers';

console.log(secureHeadersConfig);

export default () => {
  app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);
};
