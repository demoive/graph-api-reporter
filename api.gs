// https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus/
function FbSdkIsLoggedIn(){
  return FB.oauth.hasAccess();
}

function FbSdkLogout(){
  FB.oauth.reset();
}

function fetchMeInfo() {
  var resp = FB.api('/me?fields=name,picture,accounts%7Bname,id,picture,link,supports_instant_articles%7D') || {}

  return resp;
}
