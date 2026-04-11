/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** WebSocket server URL (e.g. `http://localhost:5000`). Must use the `VITE_` prefix to be exposed. */
  readonly VITE_SOCKET_URL?: string
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
