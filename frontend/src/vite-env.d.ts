/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_CHECKIN_SCRIPT_URL?: string;
  readonly VITE_CHECKIN_SUMMARY_SCRIPT_URL?: string;
  readonly MODE: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
