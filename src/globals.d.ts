/// <reference types="vite/client" />

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
  __TAURI__: any; // Declare o __TAURI__ globalmente como qualquer tipo
}
/* eslint-enable @typescript-eslint/no-explicit-any */
