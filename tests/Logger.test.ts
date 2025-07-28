import MainLogger, { Logger } from '../src/logging/Logger';


test('Testing the logger',()=>{
    console.log("Starting the test ......");
    MainLogger.warn("Testing");
    let testObj = {id: "myObject Id", text: "This is the object text"};
    MainLogger.info(testObj);
    MainLogger.info(testObj,true);
    let customLogger = new Logger({source: 'App'});
    customLogger.info("This is a new message");
    expect(true).toBe(true);


});

