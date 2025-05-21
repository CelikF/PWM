import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    // Escludi i core di Ionic così Vite non tenta di “ottimizzarli”
    exclude: ['@ionic/core', '@ionic/angular']
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Filtra via i warning che contengono "dynamic import cannot be analyzed by Vite"
        if (
          warning.code === 'UNRESOLVED_IMPORT' ||
          (warning.message &&
            warning.message.includes('The above dynamic import cannot be analyzed by Vite'))
        ) {
          return;
        }
        warn(warning);
      }
    }
  }
});
