import ErrorHandling from 'fusion-plugin-error-handling';
import CsrfProtectionPlugin, {
  FetchForCsrfToken,
} from 'fusion-plugin-csrf-protection-react';

app.register(FetchToken, CsrfProtectionPlugin);
