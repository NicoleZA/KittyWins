var sf = require('sf');
var _ = require('underscore')._;
var observableArray = require("data/observable-array");

var sql = new Sql();

function Sql() {
	var me = this;

  this.dateField = function(field, description) {
    return sf("convert(varchar,convert(datetime,{0}-36163),103) {0}",field, description || field );
  }
  this.date = function(field) {
    return sf("convert(varchar,convert(datetime,{0}-36163),103)",field );
  }

  this.fixedEncodeURIComponent = function(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  this.filterArray = function (data, searchField, searchText) {
    var filteredData = _.filter(data,function(x){
      return x[searchField].toLowerCase().indexOf(searchText) != -1;
    });
    return new observableArray.ObservableArray(filteredData);
  }
  this.observableArray = function (array) {
    return new observableArray.ObservableArray(array);
  }

  this.matterSelect = function(recordid)  {
    var url = sf("Select mat.RecordId, mat.FileRef + ' - ' + mat.Description + ' (' + CAST(mat.RecordId as varchar) + ') ' Reference, " +
                 "mat.FileRef, mat.TheirRef, mat.Description, " +
          		   "mat.DebtorPaymentDay, mat.DebtorPaymentAmount, mat.CaseNumber, " +
          		   "CASE WHEN DateInstructed > 0 THEN CONVERT(VarChar(10),CAST(mat.DateInstructed-36163 as SmallDateTime),103) ELSE '' END _DateInstructed, " +
          		   "MatType.Description MatType, " +
          		   "DocGen.Description DocumentSet, DocGen.Code, " +

          			 "CourtFlag, CASE CourtFlag WHEN 'H' THEN 'High Court' When 'M' Then 'Magistrates Court' When 'R' Then 'Regional Court' Else '' END Court, " +
          			 "CourtDate, CASE WHEN CourtDate > 0 THEN CONVERT(VarChar(10),CAST(CourtDate-36163 as SmallDateTime),103) ELSE '' END _CourtDate, " +
          			 "Defended, CASE Defended WHEN 'D' THEN 'Defended' When 'U' Then 'Undefended' Else '' END _Defended, " +
          			 "CaseType, CASE CaseType WHEN 'Act' THEN 'Action' When 'App' Then 'Application' Else '' END _CaseType, " +
          		   "ColData.RecordId ColDataId,ActingFor, " +
          		   "SheriffID,EmployerID,PTPStartDate, " +
          		   "HighCourtDivision,HighCourtAddress,MagCourtDistrict,MagCourtHeldAt, " +
          		   "ApplicationDate, Administrator, SecurityAmount, InstallmentAmount, Frequency, PaymentDate, FurtherDate, " +
          		   "LODDoneFlag,SUMDoneFlag,RDJDoneFlag,JUDDoneFlag,MOVDoneFlag,WRIDoneFlag,CCJDoneFlag, " +
          		   "IMMDoneFlag,S65DoneFlag,S57DoneFlag,EMODoneFlag, S65Court, " +
          		   "Case WHEN PTPStartDate > 0 THEN CONVERT(VarChar(10),CAST(PTPStartDate-36163 as SmallDateTime),103) ELSE '' END _PTPStartDate, " +
          		   "Case WHEN ApplicationDate > 0 THEN CONVERT(VarChar(10),CAST(ApplicationDate-36163 as SmallDateTime),103) ELSE '' END _ApplicationDate, " +
          			 "Isnull(Client.Name,'') Client, " +
          		   "Isnull(Sheriff.Name,'') Sheriff, " +
          		   "Isnull(Employer.Name,'') Employer, " +

          		   "Isnull(Employee.Name,'') Employee " +

          		   "From Matter mat " +
          		   "Left Join MatType on MatType.RecordID = mat.MatterTypeID " +
          		   "Left Join DocGen on DocGen.RecordID = mat.DocgenID " +
          		   "Left Join BondData ON mat.RecordID = BondData.MatterID " +
          		   "Left Join ColData ON mat.RecordID = ColData.MatterID " +
          		   "Left Join Employee on Employee.RecordID = mat.EmployeeID " +
          			 "left Join Party Client on Client.RecordID =  mat.ClientId " +
          		   "left Join Party Sheriff on Sheriff.RecordID =  ColData.SheriffID " +
          		   "left Join Party Employer on Employer.RecordID =  ColData.EmployerId " +
                 "Where mat.recordId = {0}",
                 recordid
               );
    return me.fixedEncodeURIComponent(url);
  }

}

module.exports = sql;
module.exports.sf = sf;
