var frameModule = require("ui/frame");
var gestures = require("ui/gestures");
var observable = require("data/observable");
var custom = require("custom");
var StackLayoutModule = require("ui/layouts/stack-layout")
var LabelModule = require("ui/label");
var ImageModule = require("ui/image");

var viewModel = (function (_super) {
    __extends(viewModel, _super);

    var categoriesAll = [];
    var me = null;
    var page = null;
    var activeTab = 0;

    //constructor
    function viewModel(args) {
        _super.call(this);
        me = this;
        page = args;
        me.set("activeTab",0);
    };

    viewModel.prototype.tabChanged = function (args) {
      me.setTabPage(args.newIndex);
    };
    
    viewModel.prototype.setTabPage = function (index) {
      if(index) activeTab = index;
      me.set("showSearchBar", false);
      switch (activeTab) {
        case 0: //Home
          me.set("showSearch", false);
          me.set("showNew", false);
          me.set("showDelete", false);
          break;
        case 1: //Shop
          me.set("showSearch", true);
          me.set("showNew", false);
          me.set("showDelete", false);
            me.categoryFetch();
          break;
        case 2: //AddressBook
          me.set("showSearch", false);
          me.set("showNew", false);
          me.set("showDelete", false);
          break;
      }
    }

    viewModel.prototype.onSearch = function () {
      me.set("showSearchBar", !me.get("showSearchBar"));
    }

    viewModel.prototype.searchData = function (args) {
      var searchText = (args.object.text).toLowerCase();
      me.set("showSearchBar", false);
      switch (activeTab) {
        case 0: //Home
          break;
        case 1: //categories
           break;
        case 2: //AddressBook
          break;
      }
    }

    //categories ----------------------------------------------------------------------------------
    viewModel.prototype.categoryFetch = function()  {
      var url = global.api +  "getjson/kryolan/category";
      fetch(url).then(function (response) { return response.json(); }).then(function (r) {
        categoriesAll = r;
         var Header = page.getViewById("Header");
         Header.backgroundImage = global.api +  "getjpg/kryolan/category/" + categoriesAll.Image;
          me.set("categoryCaption",categoriesAll.Caption);
          me.categoryFill(categoriesAll.Items);
      }, function (e) {
        alert(e);
      });
    };
    
    viewModel.prototype.categoryFill = function(categories) {
        var wrapCategories = page.getViewById("wrapCategories");
        wrapCategories.removeChildren();
        for (var i = 0; i < categories.length; i++) {
            me.categoryAdd(wrapCategories, categories[i]);
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
        if(args.SubItems) {
             var data = {
                moduleName : "subCategory/subCategory",
                context: {subCategories: args.SubItems},
                animated: true,
                transition: {name: "slide", duration: 380, curve: "easeIn"},
                clearHistory: false,
                backstackVisible: true
            }
            frameModule.topmost().navigate(data);
        } else {
             var data = {
                moduleName : "productList/productList",
                context: {code: args.Code},
                animated: true,
                transition: {name: "slide", duration: 380, curve: "easeIn"},
                clearHistory: false,
                backstackVisible: true
            }
            frameModule.topmost().navigate(data);
        }
    };

    viewModel.prototype.categoryView = function (args) {
    };

    return viewModel;
})(observable.Observable);


exports.pageLoaded = function(args) {
    var page = args.object;
    var obj = new viewModel(page);
    page.bindingContext = obj ;
};
