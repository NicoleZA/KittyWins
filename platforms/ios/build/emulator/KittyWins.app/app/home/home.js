var frameModule = require("ui/frame");
var gestures = require("ui/gestures");
var observable = require("data/observable");
var custom = require("custom");
var StackLayoutModule = require("ui/layouts/stack-layout")
var LabelModule = require("ui/label");
var ImageModule = require("ui/image");

var viewModel = (function (_super) {
    __extends(viewModel, _super);

    var me = null;
    var page = null;
 
    //constructor
    function viewModel(args) {
        _super.call(this);
        me = this;
        page = args;
    };
    
    viewModel.prototype.showKitchen = function () {
        console.log("load kitchen");
            var data = {
            moduleName : "kitchen/kitchen",
            context: {},
            animated: true,
            transition: {name: "slide", duration: 380, curve: "easeIn"},
            clearHistory: false,
            backstackVisible: true
        }
        frameModule.topmost().navigate(data);
   
    }
 
    return viewModel;
})(observable.Observable);


exports.pageLoaded = function(args) {
    var page = args.object;
    var obj = new viewModel(page);
    page.bindingContext = obj ;
};
