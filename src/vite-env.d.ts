/// <reference types="vite/client" />

/* Global variables injected by the parent window (WebView / Indexia host). */
interface WindowSigninState {
  phone: string;
  notice?: string;
  error?: string;
  busy: boolean;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/* These are ambient declarations for global variables injected by the parent 
   window at runtime (WebView / Indexia host). They are available without import. */
interface SigninState {
  phone: string;
  notice?: string;
  error?: string;
  busy?: boolean;
}
declare const signin: SigninState;
declare const mode: "signup" | "signin";
declare const setSignin: (value: Partial<SigninState>) => void;
declare const setMode: (mode: "signup" | "signin") => void;
declare const loginUser: (payload: { mobile: string }) => Promise<{ success: boolean; message?: string }>;
declare const isUnregisteredMobileError: (response: unknown) => boolean;
declare const openLogin: (role: string) => void;

/* Convenience setters derived from the global signin state. */
declare const setSigninError: (msg: string) => void;
declare const setSigninNotice: (msg: string) => void;
declare const setSigninBusy: (busy: boolean) => void;
declare const signinError: string;
declare const signinNotice: string;
declare const signinBusy: boolean;
