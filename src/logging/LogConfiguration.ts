import {LogRule, LogRuleImpl, RuleCondition} from "./config/LogRule";
import {LogLevel} from "./LogSettings";
import {Logger} from "./Logger";
import {LogManager} from "./LogManager";

export class LogConfiguration{
    private _rules:LogRule [] = [];

    public addRule(condition:RuleCondition,value:string|RegExp,level:LogLevel):void{
        this._rules.push(new LogRuleImpl(condition,value,level));
    }

    get rules(){
        return this._rules;
    }

    public detectLogLevel(logger:Logger):LogLevel{

        for (const curRule of [...this._rules].reverse()) {
            switch(curRule.condition){
                case RuleCondition.startsWith:
                    if(typeof curRule.value === 'string' && logger.source.startsWith(curRule.value)){
                        return curRule.level;
                    }
                    break;
                case RuleCondition.contains:
                    if(typeof curRule.value === 'string' && logger.source.includes(curRule.value)){
                        return curRule.level;
                    }
                    break;
                case RuleCondition.regex:
                    if ((curRule.value instanceof RegExp) && (curRule.value as RegExp).test(logger.source)) {
                        return curRule.level;
                    } else if(typeof curRule.value === 'string') {
                        // Convert string to RegExp if needed
                        const regex = new RegExp(curRule.value);
                        if(regex.test(logger.source)){
                            return curRule.level;
                        }
                    }
                    break;
            }
        }


        return logger.logLevel;
    }

    public clearConfigurations():void{
        this._rules = [];
    }


}