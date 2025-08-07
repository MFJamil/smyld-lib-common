import {LogLevel} from "../LogSettings";

export enum RuleCondition {
    startsWith,
    contains,
    regex
}


export interface LogRule{
    condition:RuleCondition;
    value:string|RegExp;
    level:LogLevel;
}

export class LogRuleImpl implements LogRule{
    condition:RuleCondition;
    value:string|RegExp;
    level:LogLevel;

    constructor(condition:RuleCondition,value:string|RegExp,level:LogLevel) {
        this.condition = condition;
        this.value = value;
        this.level= level;
    }

}