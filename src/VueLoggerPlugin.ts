import { LogSettings } from './logging/LogSettings';
import MainLogger, { Logger } from './index';
import { App } from 'vue';

export const VueLoggerPlugin = {
    /*
    install (Vue:typeof _Vue,options?:LogSettings):void{
        console.log("Starting Logger Plugin ");
        console.log("Options : " + JSON.stringify(options,undefined,1));
        Vue.prototype.$log = MainLogger;
        MainLogger.setLogSettings(options);

    },*/
    install:(app: App,options?:LogSettings)=>{
        const hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
        const PolySymbol = (name:any) => 
        // vr = vue router
        hasSymbol
            ? Symbol('[log]: ' + name )
            : ('[log]: ' ) + name;        
        console.log("Starting Logger Plugin ");
        console.log("Options : " + JSON.stringify(options,undefined,1));
        const logKey = /*#__PURE__*/ PolySymbol('router' );
        
        app.config.globalProperties.$log = MainLogger;
        app.provide(logKey,MainLogger);
        
        MainLogger.setLogSettings(options);

    },
};
declare module '@vue/runtime-core' {
  
    export interface ComponentCustomProperties {
        /**
       * {@link Logger} instance used by the application.
       */
      $log: Logger
    }
  }

  
/*
declare module 'vue/types/vue' {
    interface Vue {
        $log: Logger;
    }
}
*/

