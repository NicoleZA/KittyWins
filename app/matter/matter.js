var frameModule = require("ui/frame");
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var listViewModule = require("ui/list-view");

var viewModel = (function (_super) {
    __extends(viewModel, _super);

    //constructor
    function viewModel() {
        _super.call(this);
        me = this;
        me.loadData();
    }

    viewModel.prototype.loadData = function()  {
      var url = global.api +  "Matter?columns=recordid,fileref,description";
      fetch(url).then(function (response) { return response.json(); }).then(function (r) {
        var data = new observableArray.ObservableArray(r.data);
        me.set("matters",data);
      }, function (e) {
        alert(e);
      });
    }

    viewModel.prototype.deleteMatter = function () {
      alert("delete");
    };
    viewModel.prototype.viewMatter = function (args) {
      var index = args.index;
      var matter = me.get("matters").getItem(index);
      console.log(matter);
      if (!matter) return;
      console.log(matter.recordid);
      alert(matter.recordid);

      var data = {
        moduleName : "matterview/matterview",
        context: {matter: matter},
        animated: true,
        transition: {
          name: "slide",
          duration: 380,
          curve: "easeIn"
        },
        clearHistory: false,
        backstackVisible: true
      }
      var topmost = frameModule.topmost();
      topmost.navigate(data);
    };

    return viewModel;
})(observable.Observable);


function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = new viewModel();
}

exports.pageLoaded = pageLoaded;
