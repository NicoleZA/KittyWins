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
 
    return viewModel;
})(observable.Observable);


exports.pageLoaded = function(args) {
    var page = args.object;
    var obj = new viewModel(page);
    page.bindingContext = obj ;
};
