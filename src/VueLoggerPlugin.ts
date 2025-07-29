import { LogSettings } from './logging/LogSettings';
import MainLogger, { Logger } from './index';
import { App } from 'vue';

/**
 * Vue plugin for integrating the Logger functionality into Vue applications.
 * Provides a $log property on all Vue components and makes the logger available through dependency injection.
 * 
 * @example
 * // In your main.js or main.ts file:
 * import { createApp } from 'vue';
 * import App from './App.vue';
 * import { VueLoggerPlugin } from 'smyld-lib-common';
 * 
 * const app = createApp(App);
 * 
 * // Use the plugin with default settings
 * app.use(VueLoggerPlugin);
 * 
 * // Or with custom settings
 * app.use(VueLoggerPlugin, {
 *   logLevel: LogLevel.DEBUG,
 *   cacheLogs: true
 * });
 * 
 * app.mount('#app');
 * 
 * @example
 * // In a Vue component:
 * export default {
 *   mounted() {
 *     this.$log.info('Component mounted');
 *   },
 *   methods: {
 *     handleClick() {
 *       this.$log.debug('Button clicked', { timestamp: Date.now() });
 *     }
 *   }
 * }
 */
export const VueLoggerPlugin = {
    /**
     * Vue 3 plugin installation method.
     * 
     * @param {App} app - The Vue application instance
     * @param {LogSettings} [options] - Optional logger configuration
     */
    install: (app: App, options?: LogSettings): void => {
        // Check if Symbol is supported in the current environment
        const hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
        
        /**
         * Creates a symbol or string key for dependency injection
         * 
         * @param {string} name - The name to use in the symbol
         * @returns {symbol | string} A symbol or string key
         */
        const PolySymbol = (name: string): symbol | string => 
            hasSymbol
                ? Symbol('[log]: ' + name)
                : ('[log]: ') + name;
                
        console.log("Starting Logger Plugin");
        console.log("Options: " + JSON.stringify(options, undefined, 1));
        
        // Create a key for dependency injection
        const logKey = /*#__PURE__*/ PolySymbol('logger');
        
        // Make logger available as $log on all components
        app.config.globalProperties.$log = MainLogger;
        
        // Make logger available through dependency injection
        app.provide(logKey, MainLogger);
        
        // Apply settings if provided
        MainLogger.setLogSettings(options);
    },
};

/**
 * Type declaration to extend Vue's ComponentCustomProperties interface
 * This makes the $log property available on all Vue components with proper typing
 */
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        /**
         * Logger instance available on all Vue components.
         * Use this to log messages from your components.
         * 
         * @example
         * this.$log.info('User logged in');
         */
        $log: Logger;
    }
}

// Vue 2 type declaration (commented out as the plugin now targets Vue 3)
/*
declare module 'vue/types/vue' {
    interface Vue {
        $log: Logger;
    }
}
*/

