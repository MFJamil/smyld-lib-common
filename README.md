[![](https://data.jsdelivr.com/v1/package/npm/smyld-lib-common/badge)](https://www.jsdelivr.com/package/npm/smyld-lib-common)
[![License](https://img.shields.io/badge/License-Apache%202.0-yellowgreen.svg)](https://github.com/MFjamil/smyld-lib-common/blob/master/LICENSE)
[![](https://img.shields.io/badge/NPM-smyld--lib--common-blue)](https://www.npmjs.com/package/smyld-lib-common)
# SMYLD Common Library
is a library that contains some core APIs that helps the SPA developer, this library is a work in progress, it contains the following functionalities so far:



## 1 - Logging API:

logging API facilitates the work on SPA, printing syntax highlighted messages with date and time stamp.

### Usage

The library is available on NPM, as any standard JS/TS library, it can be easily installed via the following command:
```npm
npm install smyld-lib-common
```

To make it easy and straight forward, there is an extra instance of the logger that is created for you:
```javascript
import MainLogger from 'smyld-lib-common';



    MainLogger.info("This is a smlyd library generated Info Message");
    MainLogger.debug("This is a smlyd library generated Debug Message");
    MainLogger.warn("This is a smlyd library generated Warning Message");
    MainLogger.error("This is a smlyd library generated Error Message");



```

The output of the above code can be seen on the console of the browser as shown below:

![Library Commong Logging API usage - from smyld.org site](images/LogMessages.png)


## 2 - Visibility API:

HTML elements can define a special behavior upon being visible in the page. Using these APIs will add a nice affect to the web page design.




### Usage
The library can be referenced inside any page as a usual JavaScript library:

```html
<script src='https://cdn.jsdelivr.net/npm/smyld-lib-common@1.0.35/main.min.js'></script>
```

 In your code, you need to define an attribute with the name **shown** inside the **div** element you want to animate when it is visible, this attribute should hold the **css class name(s)** that will be applied to your element once it is visible on the screen.
 
 ```html
  <div id="part1" class="testDiv" style="top:1600px;left:340px;" shown="myCssWhenVisible">One</div>
 ```
 
 Below is a sample of animation applied to the elements once they will be visible in the screen, the animation will take place only **once** in the opened page cycle, if the user would love to review the animation, he can refresh the page. 
 
![Library Commong Logging API usage - from smyld.org site](images/visible_api_demo.gif)


