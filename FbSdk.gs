var FB = {

  baseUrl: 'https://graph.facebook.com/',


  /**
   * Initializes the SDK and OAuth2 service.
   * https://github.com/googlesamples/apps-script-oauth2
   */
  init: function (opt) {
    var url = this.baseUrl + (opt.apiVersion || '');

    this.oauth = OAuth2.createService('Facebook')
    .setAuthorizationBaseUrl('https://www.facebook.com/dialog/oauth')
    .setTokenUrl(url+'/oauth/access_token')
    .setClientId(opt.appId)
    .setClientSecret(opt.appSecret)
    .setCallbackFunction('FbSdkAuthCallback_')
    .setPropertyStore(PropertiesService.getUserProperties());
  },


  /**
   * Authorizes and makes a request to the Facebook API.
   */
  api: function (endpoint) {
    this.previousEndpointCall = endpoint;

    var resp = UrlFetchApp.fetch(this.baseUrl+endpoint, {
      headers: {
        'Authorization': 'Bearer ' + this.oauth.getAccessToken()
      }
    });

    return JSON.parse(resp.getContentText());
  },


  /**
   * Generates an authorization URL to ask a user for access to their profile on behalf of your app.
   */
  getLoginUrl: function (permissions) {
    var scopes = permissions || [
      'pages_show_list',               // For displaying a list of Pages
      'pages_manage_instant_articles', // For accessing the `supports_instant_articles` field of `/accounts` endpoint to determine if Page has signed up for IA
      'read_insights'                  // For getting the actual insights of the Page/article
    ];

    return this.oauth.getAuthorizationUrl()
      +'&scope='+scopes.join(',');
  }

};


/**
 * Handles the OAuth callback.
 */
function FbSdkAuthCallback_(request) {
  var isAuthorized = FB.oauth.handleCallback(request);

  if (isAuthorized) {
    // update sidebar
    //SpreadsheetApp.getUi().showSidebar(page);
    //ContentService.createTextOutput('Success!')
    return HtmlService.createHtmlOutput('Success! You may close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You may close this tab.');
  }
};


FB.init({
  appId: '165010617304976',
  appSecret: APP_SECRET,
  // version: 'v2.8'
});
