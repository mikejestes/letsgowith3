/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEBRTC_SIGNALING_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
