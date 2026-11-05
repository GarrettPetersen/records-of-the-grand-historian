A date review could finish with a complete artifact just before its usage exceeded the configured circuit breaker. The worker rejected the SDK’s `finished` status because it expected `completed`, forcing a separate recovery invocation.

Accept the actual `finished` status in the bounded-stop recovery guard. Preserve the recorded usage stop and keep failed/unknown terminal states, account limits, transport errors and failed cancellation rejected. Artifacts still require normal source, coverage, independence and publication validation. No budget or round limit changes.

Validation: the real-wait-helper regression fails before the fix; all 260 relevant workflow/worker/campaign/stale tests pass afterward. Independent review of exact head `2fb4d93012f083a4f91d3eb3f235f4c4665c727a` approved with zero findings. Required build CI is still running; vocabulary CI passed.
