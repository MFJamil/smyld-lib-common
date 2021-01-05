export enum Type {
    Error = 'ERR', 
    Info = 'INFO', 
    Warning = 'WARN',
    Debug = 'DEBUG',
    Default = 'LOG'}
  
  export class LogMessage {
    type: Type;
    text: string;
    date: Date;
  
    constructor(msgText: any, msgType: Type,compact:boolean=false) {
      this.type = msgType;
      if (typeof msgText !== 'string')
        msgText = compact?JSON.stringify(msgText):JSON.stringify(msgText,undefined,2);
      this.text = msgText;
      this.date = new Date();
    }
  }
  