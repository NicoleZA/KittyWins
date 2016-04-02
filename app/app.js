var application = require("application");
global.api = "http://www.legalsuite.co.za:7200/";
//global.api = "http://192.168.43.37:7200/api/";

application.start({ moduleName: "home/home" });
