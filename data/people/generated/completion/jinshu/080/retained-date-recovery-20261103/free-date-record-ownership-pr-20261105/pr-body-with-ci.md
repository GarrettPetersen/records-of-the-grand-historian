The free date reviewer could save checks for IDs outside its assigned scope and discover the error only when finishing. A malformed batch could also leave earlier records partially written. Validate ownership and every row before changing the retained draft, and reject duplicate keys within one call. Corrections in later calls and repair-record keys continue to work.

Validation: all 11 offline OpenRouter tests pass, including six new persisted-draft regressions; four failures were reproduced against the previous implementation. Independent review is pending. The running production runtime and chapter artifacts have not adopted this change.

The required master-build date-worker step now includes the OpenRouter tests, so these regressions are checked in CI as well.
