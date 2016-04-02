var frameModule = require("ui/frame");
var observable = require("data/observable");
var custom = require("custom");

var viewModel = (function (_super) {
    __extends(viewModel, _super);

    var me = null;
    var matter = null;
    var filenotesAll = null;

    //constructor
    function viewModel(args) {
        _super.call(this);
        me = this;
        me.args = args;
        me.matterFetch(me.args.matter.recordid);
    }

    viewModel.prototype.tabChanged = function (args) {
      me.setTabPage(args.newIndex);
    }
    viewModel.prototype.setTabPage = function (index) {
      if(index) me.set("activeTab",index);
      var activeTab = me.get("activeTab");
      me.set("showSearchBar", false);
      switch (activeTab) {
        case 0: //Details
          me.set("showSearch", false);
          me.set("showNew", false);
          me.set("showDelete", false);
          break;
        case 1: //Filenotes
          me.set("showSearch", true);
          me.set("showNew", false);
          me.set("showDelete", true);
          if(!filenotesAll) me.filenoteFetch(me.args.matter.recordid);
          break;
        case 2: //FeeNotes
          me.set("showSearch", true);
          me.set("showNew", false);
          me.set("showDelete", false);
          break;
      }
    }

    viewModel.prototype.editviewModel = function (args) {
      var index = args.index;
      console.log(index);
      var viewModel = me.get("viewModels").getItem(index);
      console.log(viewModel);
    };

    //Matter ----------------------------------------------------------------------------------
    viewModel.prototype.matterFetch = function(recordid)  {
      var script = custom.matterSelect(recordid);
      var url = custom.sf("{0}Query?script={1}",global.api,script);
      fetch(url).then(function (response) { return response.json(); }).then(function (r) {
          if(r.err) {
            alert(r.err)
          } else {
            me.matter = r.data[0]
            me.matterFill(me.matter);
          }
        }, function (e) {
          alert(e);
      });
    }

    viewModel.prototype.matterFill = function(record)  {
//      me.set("reference", record.description + " (" + record.recordid + ")");
      for (var key in record) {
        me.set(key, record[key]);
      }
    }

    //Filenotes ----------------------------------------------------------------------------------
    viewModel.prototype.showFileNotes = function (args) {
      var data = {
        moduleName : "filenotes/filenotes",
        context: {matter: me.matter},
        animated: true,
        transition: {name: "slide", duration: 380, curve: "easeIn"}
      }
      frameModule.topmost().navigate(data);
    };

    viewModel.prototype.filenoteFetch = function(matterid)  {
      var url = global.api +  "filenotelist?columns=recordid,date,description&filter=matterid=" + matterid;
      console.log(url);
      fetch(url).then(function (response) { return response.json(); }).then(function (r) {
        me.filenotesAll = r.data;
        me.set("filenotes",custom.observableArray(me.filenotesAll));
      }, function (e) {
        alert(e);
      });
    }

    viewModel.prototype.filenoteEdit = function (args) {
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
