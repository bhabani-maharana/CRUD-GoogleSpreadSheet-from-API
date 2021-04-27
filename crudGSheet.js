function doGet(e){
 var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1C4g4fphHY70Zifx16iB3axoqAkolM-i5vyGGfg-TRzk/edit#gid=0");

// Sheet Name, Chnage Sheet1 to Users in Spread Sheet. Or any other name as you wish
 var sheet = ss.getSheetByName("Sheet1");
 return getUsers(sheet); 
 
}

function getUsers(sheet){
  var jo = {};
  var dataArray = [];

// collecting data from 2nd Row , 1st column to last row and last column
  var rows = sheet.getRange(2,1,sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
  
  for(var i = 0, l= rows.length; i<l ; i++){
    var dataRow = rows[i];
    var record = {};
    record['id'] = dataRow[0];
    record['Actual'] = dataRow[1];
    record['Rework'] = dataRow[2];
    record['Alteration'] = dataRow[3];
    
    dataArray.push(record);
    
  }  
  
  jo.user = dataArray;
  
  var result = JSON.stringify(jo);
  
  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  
}  

function doPost(e) {
  
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("Sheet1");
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; //read headers
  var nextRow = sheet.getLastRow(); // get next row
  var cell = sheet.getRange('a1');
  var col = 0;
  var doesExist = 0;
  for(var i = 2; i <= nextRow; i++) {
      //e.parameter[] gets the values from response url
    if(sheet.getRange('A'+i).getValue() == e.parameter['id']) {
      sheet.getRange('A' + i + ':D' +i).setValues([[e.parameter['id'],e.parameter['Actual'],e.parameter['Rework'],e.parameter['Alteration']]]);
      doesExist = 1; 
    }
  }
  if(doesExist == 0) {
    for (j in headers){ // loop through the headers and if a parameter name matches the header name insert the value
      if (headers[j] == "Timestamp"){
        val = new Date();
      } else {
        val = e.parameter[headers[j]]; 
      }
      cell.offset(nextRow, col).setValue(val);
      col++;
    }
  }

  var app = UiApp.createApplication(); // included this part for debugging so you can see what data is coming in
  var panel = app.createVerticalPanel();
  for( p in e.parameters){
    panel.add(app.createLabel(p +" "+e.parameters[p]));
  }
  app.add(panel);
  return app;
};

//========== Update Specific Row ================
// function replaceRow(e)
// {
//   var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
//   var sheet = ss.getSheetByName("Sheet1");
//   var lastRow = sheet.getLastRow(); // get next row
//   var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]; //read headers
  
//   for(var i = 2; i <= lastRow; i++) {
//     if(sheet.getRange(i,1).getValue() == e.parameter[headers[0]]) {
//       sheet.getRange('A' + i + ':D' +i).setValues([[e.parameter[headers[0],headers[0],headers[0],headers[0]]]]); 
//     }
//   }
// }

function setUp() {
  ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet().getId());
}
