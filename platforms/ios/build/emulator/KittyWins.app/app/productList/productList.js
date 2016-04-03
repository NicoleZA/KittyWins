var frameModule = require("ui/frame");
var gestures = require("ui/gestures");
var observable = require("data/observable");
var custom = require("custom");
var StackLayoutModule = require("ui/layouts/stack-layout")
var LabelModule = require("ui/label");
var ImageModule = require("ui/image");

var viewModel = (function (_super) {
    __extends(viewModel, _super);

    var code = "";
    var Products = null;
    var me = null;
    var page = null;

    //constructor
    function viewModel(args) {
        _super.call(this);
        me = this;
        page = args; 
        me.code = page.navigationContext.code;
        me.ProductFetch();       
     };

     viewModel.prototype.onSearch = function () {
      me.set("showSearchBar", !me.get("showSearchBar"));
    }

    viewModel.prototype.searchData = function (args) {
      var searchText = (args.object.text).toLowerCase();
      me.set("showSearchBar", false);
    }

    //Products ----------------------------------------------------------------------------------
    viewModel.prototype.ProductFetch = function()  {
      var url = global.api +  "getjson/kryolan/Product/" + me.code ;
      console.log(url);
      fetch(url).then(function (response) { return response.json(); }).then(function (r) {
        Products = r;
         for (var i = 0; i < Products.Items.length; i++) {
            Products.Items[i].Image = global.api +  "getimg/kryolan/Product/" +  Products.Items[i].Image;
         }
         var Header = page.getViewById("Header");
         Header.backgroundImage = global.api +  "getimg/kryolan/Product/" + Products.Image;
          me.set("ProductCaption",Products.Caption);
          me.set("productItems", Products.Items)
       }, function (e) {
        alert(e);
      });
    };

   viewModel.prototype.ProductFill = function(Products) {
        if(!Products) return;
        for (var i = 0; i < Products.length; i++) {
            me.ProductAdd(Products[i]);
        }
    };
    
   viewModel.prototype.ProductAdd = function(Product) {
        var wrapProducts = page.getViewById("wrapProducts");

        var stack = new StackLayoutModule.StackLayout();
        stack.width = 140;
        stack.margin = 10;

        var image = new ImageModule.Image();
        image.src = global.api +  "getimg/kryolan/Product/" + Product.Image;
        image.height = 120;
        image.horizontalAlignment = "centre"
        stack.addChild(image);

        var label = new LabelModule.Label();
        label.text = Product.Description;
        label.horizontalAlignment = "centre"
        label.className = "listTitle"
        stack.addChild(label);
        
        stack.on(gestures.GestureTypes.tap, function (args) {
            me.ProductTap(Product);
        });
        
        wrapProducts.addChild(stack);
    };

    viewModel.prototype.ProductTap = function (args) {
        alert(args.Code);
    };

    return viewModel;
})(observable.Observable);


exports.pageLoaded = function(args) {
    var page = args.object;
    var obj = new viewModel(page);
    page.bindingContext = obj ;
};
