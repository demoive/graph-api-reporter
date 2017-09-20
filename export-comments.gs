
function menu_exportComments() {
  if (FbSdkIsLoggedIn()) {
    promptForPostId();
  } else {
    showDialogForFbLoginWithNextAction('promptForPostId');
  }
}


function promptForPostId() {
  var ui = SpreadsheetApp.getUi();

  var promptResponse = ui.prompt('Post ID (leave blank for current sheet):');

  if (promptResponse.getSelectedButton() !== ui.Button.CLOSE) {
    exportCommentsFromPostId(promptResponse.getResponseText());
  }
}

////////////////////////////////////////////////////////////////////////////////
// Simon's code...
////////////////////////////////////////////////////////////////////////////////

function exportCommentsFromPostId(id) {
  var ui = SpreadsheetApp.getUi();
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

  id = id ? id : spreadSheet.getActiveSheet().getName();
  //ui.alert(id);return;

  var sheet = spreadSheet.getSheetByName(id);
  if (sheet === null) {
    sheet = spreadSheet.insertSheet(id);
  }
  sheet.clear();
  sheet.appendRow(['Name', 'Comment', 'Link to Comment', 'Likes', 'Created Time']);


  var limit = 500; // Did a few experiments to find ~800 to be a good maximum page size
  getComments('/'+id+'/comments?fields=created_time,from,message,id,like_count&order=reverse_chronological&limit='+limit);
  function getComments(endpoint) {
    //var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    //var sheet = spreadSheet.getSheetByName(id);

    endpoint = endpoint.replace(/https?:\/\/graph\.facebook\.com\/v\d+\.\d+/, '');
    //ui.alert(endpoint);
    var resp = FB.api(endpoint);

    //Logger.log(resp);return;

    var nextUrl = resp.paging.next;
    var comments = resp.data;

    //// Slow loop insert (deprecated)
    //comments.forEach(function(comment){
    //  sheet.appendRow([comment.from.name, comment.message, 'https://www.facebook.com/' + comment.id, comment.created_time]);
    //});

    // Fast range insert
    var range = sheet.getRange(sheet.getLastRow() + 1, 1, comments.length, 5); // Last param must match number of columns
    range.setValues(comments.map(function(comment) {
      return [comment.from.name, comment.message, 'https://www.facebook.com/' + comment.id, comment.like_count, comment.created_time];
    }));

    // Page through results
    if (nextUrl) {
      getComments(nextUrl);
    }
  }
}
