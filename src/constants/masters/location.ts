// Location masters are served by the backend now:
//   states → GET /masters/states
//   cities → GET /masters/cities?state={state}  (loaded per state, cached in useMasters)
// This module only carries the shared type.

export type CitiesByState = Record<string, readonly string[]>;
