import MainLogger from '../src/utils/Logger';


test('Testing the logger',()=>{
    console.log("Starting the test ......");
    MainLogger.warn("Testing");
    let testObj = {id: "myObject Id", text: "This is the object text"};
    MainLogger.info(testObj);
    MainLogger.info(testObj,true);

    expect(true).toBe(true);


});

