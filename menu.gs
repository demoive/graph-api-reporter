function menu_init() {
  var ui = SpreadsheetApp.getUi();

  // var menuInstantArticles = ui.createMenu('Instant Articles')
  //   .addItem('Single Article Insights', 'menu_iaInsightsArticle')
  //   .addItem('Aggreggate Insights', 'menu_iaInsightsAggregate');

  //ui.createMenu('Facebook Reports')
  ui.createAddonMenu()
  // .addSubMenu(menuInstantArticles)
  .addItem('Instant Article Insights', 'menu_instantArticles')
  .addItem('Export Comments', 'menu_exportComments')
  .addSeparator()
  .addItem('Facebook Login', 'showDialogForFbLoginWithNextAction')
  .addItem('Debug Facebook Login', 'menu_debugFbLogin')
  .addToUi();
}

function menu_instantArticles() {
  //FbLoginInterceptGuard('showSidebarForInstantArticles');
  /**/
  //FbSdkLogout();
  if (FbSdkIsLoggedIn()) {
    showSidebarForInstantArticles();
  } else {
    showDialogForFbLoginWithNextAction('showSidebarForInstantArticles');
  }
  /**/
}

function menu_debugFbLogin() {
  if (FbSdkIsLoggedIn()) {
    showDialogForFbLoginDebug();
  } else {
    showDialogForFbLoginWithNextAction('showDialogForFbLoginDebug');
  }
}

/** /
function FbLoginInterceptGuard(functionName) {
  //FbSdkLogout();
  if (FbSdkIsLoggedIn()) {
    window[functionName]();
  } else {
    showDialogForFbLoginWithNextAction(functionName);
  }
}
/**/

function showDialogForFbLoginDebug() {
  var ui = SpreadsheetApp.getUi();

  var resp = FB.api('/debug_token?input_token='+FB.oauth.getAccessToken());
  resp.data.user = FB.api('/'+resp.data.user_id+'?fields=name,picture');
  resp.data.access_token = FB.oauth.getAccessToken();

  var template = HtmlService.createTemplateFromFile('dialog-fb-login-debug-t');
  template.debugInfo = resp.data;

  var html = HtmlService
  .createHtmlOutput(template.evaluate())
  .setWidth(500)
  .setHeight(250)
  ;

  ui.showModalDialog(html, 'Facebook Login Debug Info');
}
