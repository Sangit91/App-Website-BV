/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GEMINI_API_KEY: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_HOSPITAL_ADDRESS: string;
  readonly VITE_HOTLINE: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}