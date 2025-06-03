/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly API_URL: string;
    // Add other environment variables here
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}