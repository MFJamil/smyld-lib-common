import { LogMessage, Type } from './LogMessage';


export class Logger{
  dateFormat:string = 'y-MM-dd_HH:mm:ss';
  options = { month: "long", day: "numeric", year: "numeric" };
  locale = "de-DE";
  
  private createDate():string{
    return new Date().toLocaleString();
    //return new Date().toLocaleString(this.locale, this.options);
    //return new Intl.DateTimeFormat(this.locale, this.options).format();
  }

  public log(text:any){
    console.log('%c[' + this.createDate() + '] : %c' + text,'color:blue;','color:black;');
  }

  public info(text:any,compact:boolean=false){
    this.logMessage(new LogMessage(text,Type.Info,compact));
  }
  public error(text:any,compact:boolean=false){
    this.logMessage(new LogMessage(text,Type.Error,compact));
  }
  public warn(text:any,compact:boolean=false){
    this.logMessage(new LogMessage(text,Type.Warning,compact));
  }
  public debug(text:any,compact:boolean=false){
    this.logMessage(new LogMessage(text,Type.Debug,compact));
  }

  private debugOld(text:any){
    console.debug('%c[' + this.createDate() + '] : %c' + text,'color:blue;','color:black;');
  }

  logMessage(msg:LogMessage){
    switch(msg.type){
          case Type.Info:
            console.info(this.composeLogMessage(msg),'color:blue;','color:' + this.getMsgLogColor(msg) + ';','color:blue;','color:black;');
            break;
          case Type.Error:
            console.error(this.composeLogMessage(msg),'color:blue;','color:' + this.getMsgLogColor(msg) + ';','color:blue;','color:black;');
            break;
          case Type.Warning:
            console.warn(this.composeLogMessage(msg),'color:blue;','color:' + this.getMsgLogColor(msg) + ';','color:blue;','color:black;');
            break;
          case Type.Debug:
            console.debug(this.composeLogMessage(msg),'color:blue;','color:' + this.getMsgLogColor(msg) + ';','color:blue;','color:black;');
            break;
  
            default:
            console.log(this.composeLogMessage(msg),'color:blue;','color:' + this.getMsgLogColor(msg) + ';','color:blue;','color:black;');
            break;
        }
  }
  private getMsgLogColor(msg:LogMessage):string{
    switch(msg.type){
      case Type.Info:
        return 'green';
      case Type.Error:
        return 'red';
      case Type.Warning:
        return 'orang';
      case Type.Debug:
        return 'purple';
      default:
        return 'black';
    }
}
  private composeLogMessage(msg:LogMessage):any{
    return '%c[' + this.createDate() +'] %c' + msg.type + ' %c:: %c' + msg.text;
  }
};
const MainLogger = new Logger();
export default MainLogger;

