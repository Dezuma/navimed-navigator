/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NAVI_AI_ENDPOINT?: string;
  readonly VITE_NAVI_CALLBACK_URL?: string;
  /** Demo-only: matches mock server `NAVI_API_KEY` if set; visible in browser bundle */
  readonly VITE_NAVI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
