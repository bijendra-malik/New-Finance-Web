// Shared axios client for every franchise portal endpoint.
//
// The franchisor portal authenticates with the user bearer token (token) —
// never a separate franchise key — so these requests go through the shared
// axiosInstance instead of a parallel axios instance that read a dedicated
// FRANCHISE_TOKEN_KEY. The Axios interceptors in axiosInstance already attach
// the user token to every request and clear the right session on 401.
//
// This module is kept as a thin wrapper over axiosInstance for files that still
// import `franchiseAxios` directly; the interceptors are now identical to the
// shared instance, and the separate client is only a compatibility shim.

import axiosInstance from "./axiosInstance";

export const franchiseAxios = axiosInstance;
