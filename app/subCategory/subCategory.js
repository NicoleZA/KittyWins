var frameModule = require("ui/frame");
var gestures = require("ui/gestures");
var observable = require("data/observable");
var custom = require("custom");
var StackLayoutModule = require("ui/layouts/stack-layout")
var LabelModule = require("ui/label");
var ImageModule = require("ui/image");

var viewModel = (function (_super) {
    __extends(viewModel, _super);

    var subCategories = null;
    var me = null;
    var page = null;

    //constructor
    function viewModel(args) {
        _super.call(this);
        me = this;
        page = args;
        subCategories = page.navigationContext.subCategories;
         var Header = page.getViewById("Header");
         Header.backgroundImage = global.api +  "getimg/kryolan/category/" + subCategories.Image;
        me.set("categoryCaption",subCategories.Caption);
        
        me.categoryFill(subCategories.Items);
     };

     viewModel.prototype.onSearch = function () {
      me.set("showSearchBar", !me.get("showSearchBar"));
    }

    viewModel.prototype.searchData = function (args) {
      var searchText = (args.object.text).toLowerCase();
      me.set("showSearchBar", false);
    }

    //Categories ----------------------------------------------------------------------------------
    viewModel.prototype.categoryFill = function(Categories) {
        if(!Categories) return;
        var wrapCategories = page.getViewById("wrapCategories");
        wrapCategories.removeChildren();
        for (var i = 0; i < Categories.length; i++) {
            me.categoryAdd(wrapCategories, Categories[i]);
        }
    };
    
   viewModel.prototype.categoryAdd = function(wrap, category) {

        var stack = new StackLayoutModule.StackLayout();
        stack.width = 140;
        stack.margin = 10;

        var image = new ImageModule.Image();
        image.src = global.api +  "getimg/kryolan/category/" + category.Image;
        image.height = 120;
        image.horizontalAlignment = "centre"
        stack.addChild(image);

        var label = new LabelModule.Label();
        label.text = category.Description;
        label.horizontalAlignment = "centre"
        label.className = "listTitle"
        stack.addChild(label);
        
        stack.on(gestures.GestureTypes.tap, function (args) {
            me.categoryTap(category);
        });
        
        wrap.addChild(stack);
    };

    viewModel.prototype.categoryTap = function (args) {
        var data = {
            moduleName : "productList/productList",
            context: {code: args.Code},
            animated: true,
            transition: {name: "slide", duration: 380, curve: "easeIn"},
            clearHistory: false,
            backstackVisible: true
        }
        frameModule.topmost().navigate(data);
    };

    return viewModel;
})(observable.Observable);


exports.pageLoaded = function(args) {
    var page = args.object;
    var obj = new viewModel(page);
    page.bindingContext = obj ;
};
