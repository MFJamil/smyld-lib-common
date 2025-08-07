import { LogConfiguration } from '../src/logging/LogConfiguration';
import { Logger } from '../src/logging/Logger';
import { LogLevel } from '../src/logging/LogSettings';
import { RuleCondition } from '../src/logging/config/LogRule';
import {LogManager} from "../src";

describe('LogConfiguration', () => {
  beforeEach(()=>{
    LogManager.getInstance().clearAll();
  });

  test('should detect log level based on startsWith rule with string value', () => {
    const config = new LogConfiguration();
    config.addRule(RuleCondition.startsWith, 'app.', LogLevel.DEBUG);
    
    const logger = new Logger({ source: 'app.component' });
    const level = config.detectLogLevel(logger);
    
    expect(level).toBe(LogLevel.DEBUG);
  });
  
  test('should detect log level based on contains rule with string value', () => {
    const config = new LogConfiguration();
    config.addRule(RuleCondition.contains, 'component', LogLevel.WARN);
    
    const logger = new Logger({ source: 'app.component.button' });
    const level = config.detectLogLevel(logger);
    
    expect(level).toBe(LogLevel.WARN);
  });
  
  test('should detect log level based on regex rule with RegExp value', () => {
    const config = new LogConfiguration();
    config.addRule(RuleCondition.regex, /^api\.v\d+\..+$/, LogLevel.ERROR);
    
    const logger = new Logger({ source: 'api.v1.users' });
    const level = config.detectLogLevel(logger);
    
    expect(level).toBe(LogLevel.ERROR);
  });
  
  test('should detect log level based on regex rule with string value', () => {
    const config = new LogConfiguration();
    config.addRule(RuleCondition.regex, '^service\\..*Service$', LogLevel.ALL);
    
    const logger = new Logger({ source: 'service.UserService' });
    const level = config.detectLogLevel(logger);
    
    expect(level).toBe(LogLevel.ALL);
  });
  
  test('should return default log level when no rules match', () => {
    const config = new LogConfiguration();
    config.addRule(RuleCondition.startsWith, 'app.', LogLevel.DEBUG);
    
    const logger = new Logger({ source: 'service.UserService' });
    const level = config.detectLogLevel(logger);
    
    expect(level).toBe(LogLevel.INFO); // Default level
  });
  
  test('should apply rules in reverse order', () => {
    const config = new LogConfiguration();
    config.addRule(RuleCondition.startsWith, 'app.', LogLevel.DEBUG);
    config.addRule(RuleCondition.startsWith, 'app.component', LogLevel.WARN);
    
    const logger = new Logger({ source: 'app.component.button' });
    const level = config.detectLogLevel(logger);
    
    // Should match the second rule (WARN) because rules are applied in reverse order
    expect(level).toBe(LogLevel.WARN);
  });
});