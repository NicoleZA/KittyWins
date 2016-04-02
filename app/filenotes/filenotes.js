var frameModule = require("ui/frame");
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var listViewModule = require("ui/list-view");
//var moment = require('moment');

var viewModel = (function (_super) {
    __extends(viewModel, _super);

    var me = null;
    var filenotesAll = [];
  
    //constructor
    function viewModel(args) {
        _super.call(this);
        me = this;
        me.args = args;
        me.fillMatter(me.args.matter);
        me.loadData(me.args.matter.RecordId);
    }

    viewModel.prototype.fillMatter = function(record)  {
      for (var key in record) {
        me.set(key, record[key]);
      }
    }

    viewModel.prototype.loadData = function(matterid)  {
      var url = global.api +  "filenotelist?columns=recordid,date,description&filter=matterid=" + matterid;
      fetch(url).then(function (response) { return response.json(); }).then(function (r) {
        filenotesAll = r.data;
        me.set("filenotes",new observableArray.ObservableArray(filenotesAll));
      }, function (e) {
        alert(e);
      });
    }

    viewModel.prototype.editFileNote = function (args) {
      var index = args.index;
      var filenote = me.get("filenotes").getItem(index);

      var data = {
        moduleName : "filenoteedit/filenoteedit",
        context: {record: filenote, matter: me.args.matter},
        animated: true,
        transition: {name: "slide", duration: 380, curve: "easeIn"}
      }
      frameModule.topmost().navigate(data);
    };

    return viewModel;
})(observable.Observable);


exports.pageLoaded = function(args) {
    var page = args.object;
    page.bindingContext = new viewModel(page.navigationContext) ;
};
