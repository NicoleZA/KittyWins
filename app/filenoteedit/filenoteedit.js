var frameModule = require("ui/frame");
var observable = require("data/observable");
var textViewModule = require("ui/text-view");
var datePickerModule = require("ui/date-picker");
var moment = require('moment');
var _ = require('underscore')._;

var viewModel = (function (_super) {
    __extends(viewModel, _super);

    var me = null;

    //constructor
    function viewModel(args) {
        _super.call(this);
        me = this;
        me.args = args
        me.setMatter(args.matter);
        me.setRecord(args.record);
        me.set("showDatePicker", false);
        console.log("date");
        var date = moment(args.record.date,'DD/MM/YYYY');
        console.log(date.toDate());
        console.log(date.date());
        me.set("day", date.month());
        me.set("month", date.year());

    }
//    var month =
    viewModel.prototype.toggleDatePicker = function() {
      console.log("toggleDatePicker");
    	me.set("showDatePicker", !me.get("showDatePicker"));
    }
    viewModel.prototype.datePickerAccept = function(args) {
      me.set("showDatePicker",false);
      console.log(args.action);
    }
    viewModel.prototype.datePickerCancel = function(args) {
      console.log('cancel');
      me.set("showDatePicker",false);
      console.log(args);
      console.log(_.keys(args.itemSelected).toString());
    }

    viewModel.prototype.setMatter = function(record)  {
      me.set("matterid", record.recordid);
      me.set("fileref", record.fileref);
      me.set("matter", record.description);
      me.set("matter", record.description + "(" + record.recordid + ")");
    }

    viewModel.prototype.setRecord = function(record)  {
      me.set("recordid", record.recordid);
      me.set("date", record.date);
      me.set("description", record.description);
    }

    viewModel.prototype.deleteviewModel = function () {
      alert("delete");
    };

    viewModel.prototype.editviewModel = function (args) {
      var index = args.index;
      console.log(index);
      var viewModel = me.get("viewModels").getItem(index);
      console.log(viewModel);
    };

    viewModel.prototype.showFileNotes = function (args) {
      var data = {
        moduleName : "filenotes/filenotes",
        context: {record: me.record},
        animated: true,
        transition: {
          name: "slide",
          duration: 380,
          curve: "easeIn"
        }
      }
      var topmost = frameModule.topmost();
      topmost.navigate(data);
    };


    return viewModel;
})(observable.Observable);


exports.pageLoaded = function(args) {
    var page = args.object;
    page.bindingContext = new viewModel(page.navigationContext) ;
};

// export class ImageButton extends button.Button {
//     private _icon: string;
//
//     // icon
//
//     public get icon(): string {
//         return this._icon;
//     }
//
//     public set icon(value: string) {
//         this._icon = value;
//
//         this.cssClass = "buttonImage";
//         this.backgroundImage = "~/res/icons/white/" + value + "_white.png";
//     }
//
//     // text override with spacing
//
//     public get textPadded(): string {
//         return this._getValue(button.Button.textProperty);
//     }
//
//     public set textPadded(value: string) {
//         this._setValue(button.Button.textProperty, "       " + value + "  ");
//     }
// }
