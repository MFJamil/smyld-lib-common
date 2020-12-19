import MainLogger from '../src/utils/Logger';


test('Testing the logger',()=>{
    console.log("Starting the test ......");
    MainLogger.warn("Testing");
    expect(true).toBe(true);


});

