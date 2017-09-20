
function datetimeToDate(datetime) {
  // 2017-03-02T08:00:00+0000
  var date = datetime.match(/\d{4}-\d{2}-\d{2}/) || [];

  return date[0];
}

function log(obj) {
  Logger.log(JSON.stringify(obj, null, 2));
}

/**
 * Variable substitution on a string.
 *
 * Scans through a string looking for expressions enclosed within double curly braces.
 * If an expression is found, use it as a key on the object,
 * and if the key has a string or number value,
 * it is substituted for the bracket expression and it repeats.
 *
 * Originally by Douglas Crockford: http://javascript.crockford.com/remedial.html
 */
if (!String.prototype.supplant) {
  String.prototype.supplant = function (o) {
    return this.replace(
      /{{([^{}]*)}}/g,
      function (a, b) {
        var r = o[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  };
}
