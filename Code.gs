
function onOpen() {
  menu_init();
  //menu_instantArticles();
}

////////////////////////////////////////////////////////////////////////////////

function showDialogForFbLoginWithNextAction(nextFunction) {
  var ui = SpreadsheetApp.getUi();

  var template = HtmlService.createTemplateFromFile('dialog-fb-login-t');
  template.postLoginAction = nextFunction;

  var html = HtmlService
  .createHtmlOutput(template.evaluate())
  .setWidth(300)
  //.setHeight(130)
  .setHeight(180)
  ;

  ui.showModalDialog(html, 'Facebook Login');
}

function showSidebarForInstantArticles() {
  var ui = SpreadsheetApp.getUi();

  var template = HtmlService.createTemplateFromFile('sidebar-ia-insights-t');
  template.me = fetchMeInfo();

  var html = HtmlService
  .createHtmlOutput(template.evaluate())
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  .setTitle('Instant Articles Insights Reporting')
  ;

  ui.showSidebar(html);
}

function saveReport() {
  SpreadsheetApp.getActiveSpreadsheet().duplicateActiveSheet();
  //SpreadsheetApp.getActiveSpreadsheet().renameActiveSheet("Saved Report");
}

////////////////////////////////////////////////////////////////////////////////

function getUserProperties() {
  var userProperties = PropertiesService.getUserProperties();
  var allProperties = userProperties.getProperties();

  // // Remove items from the "oauth2.*" namespace.
  // Object.keys(allProperties).map(function (key) {
  //   if (key.match(/^oauth2\./)) {
  //     delete allProperties[key];
  //   }
  // });
  // // return allProperties;

  //return JSON.parse(allProperties['fb.ia']);
  return allProperties;
}
