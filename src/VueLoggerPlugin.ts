import _Vue from 'vue';
import Vue from 'vue';
import { LogSettings } from './logging/LogSettings';
import MainLogger from './index';
import { Logger } from './logging/Logger';

export const LoggerPlugin = {
    install (Vue:typeof _Vue,options?:LogSettings):void{
        console.log("Starting Logger Plugin ");
        console.log("Options : " + JSON.stringify(options,undefined,1));
        Vue.prototype.$log = MainLogger;
        MainLogger.setLogSettings(options);

    },
};

declare module 'vue/types/vue' {
    interface Vue {
        $log: Logger;
    }
}
