import ErrorHandling from 'fusion-plugin-error-handling';
import CsrfProtectionPlugin, { FetchForCsrfToken, CsrfIgnoreRoutesToken } from 'fusion-plugin-csrf-protection-react';
app.register(FetchToken, CsrfProtectionPlugin);
__NODE__ && app.register(CsrfIgnoreRoutesToken, ['/_errors']);
