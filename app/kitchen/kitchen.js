var frameModule = require("ui/frame");
var gestures = require("ui/gestures");
var observable = require("data/observable");
var custom = require("custom");
var StackLayoutModule = require("ui/layouts/stack-layout")
var LabelModule = require("ui/label");
var ImageModule = require("ui/image");
var orientationModule = require("nativescript-screen-orientation");
var absoluteLayoutModule = require("ui/layouts/absolute-layout");

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
 
     viewModel.prototype.moveRight = function () {
      var l = page.getViewById("layout");
        var lp = absoluteLayoutModule.AbsoluteLayout.getLeft(l);
         var kitty = page.getViewById("kitty");
        var pos = absoluteLayoutModule.AbsoluteLayout.getLeft(kitty) + 1;
        absoluteLayoutModule.AbsoluteLayout.setLeft(kitty, pos);
     }
 
      viewModel.prototype.moveLeft = function () {
        var kitty = page.getViewById("kitty");
        var pos = absoluteLayoutModule.AbsoluteLayout.getLeft(kitty) - 1;
        if(pos > 0) absoluteLayoutModule.AbsoluteLayout.setLeft(kitty, pos);
     }
 
    return viewModel;
})(observable.Observable);


exports.pageLoaded = function(args) {
    orientationModule.setCurrentOrientation("landscape");
    var page = args.object;
    var obj = new viewModel(page);
    page.bindingContext = obj ;
};

 
 exports.onNavigatingFrom = function(args) {
     alert("nav from");
     orientationModule.orientationCleanup();
     
 }