/**
 * Created by Atypique on 10/05/2017.
 */

//Identifiant du client (Jawbone dev console)
const CLIENT_ID = "rw6Z68ARgZI";

//Secret du client (Jawbone dev console)
const CLIENT_SECRET = "81bec818ff138aace720c1a9342ec6a7a7f75a55";

//Session memory, if local storage is not available
var session = {};

//User singleton instance
var user;


//Check if local storage is available
function isStorageEnabled() {
    return typeof(Storage) !== "undefined";
}

//permet de garder la data dont on a besoin
function setSession(key, value) {
  if (isStorageEnabled()) {
    window.localStorage.setItem(key, value);
  } else {
    session[key] = value;
  }
}
//récuperer la data dont a besoin
function getSession(key) {
  if (isStorageEnabled()) {
    var value = window.localStorage.getItem(key);
    return 'undefined' === value ? undefined : value;
  }
  return session[key];
}

function getCode() {
  var regex = new RegExp("[\\?&]code=([^&#]*)");
  var results = regex.exec(window.location.href);
  return results == null ? null : results[1];
}

function disconnect() {
  var uri = $(this).attr('href');
  user.disconnect(function(data, textStatus, jqXHR) {
    setSession("token", null);
    window.location.href = uri;
  });
  return false;
}

$(document).ready(function() {
  user = new User();
  var code = getCode();
  if (code) {
    user.requestToken(code);
  } else {
    user.load();
  }
  $('#disconnect').on('click', disconnect);
  $('a').each(function() {
    if (this.href.indexOf('https://fitpet.comelaire.fr/') !== -1) {
      var pathArray = location.href.split( '/' );
      var protocol = pathArray[0];
      var host = pathArray[2];
      var url = protocol + '//' + host;
      this.href = ('' + this.href).replace('https://fitpet.comelaire.fr/', url);
    }
  });
});

