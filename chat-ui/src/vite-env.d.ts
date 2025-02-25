/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_SERVER_URI: string;
  VITE_APP_TITLE: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
