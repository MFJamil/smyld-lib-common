import Vue from 'vue';
import {Logger} from '../logging/Logger'

declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
        $log :Logger;
    }
  }