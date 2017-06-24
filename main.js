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

//Store data to local storage, or session memory if storage is not enabled
function setSession(key, value) {
  if (isStorageEnabled()) {
    window.localStorage.setItem(key, value);
  } else {
    session[key] = value;
  }
}

//Get data from local storage
function getSession(key) {
  if (isStorageEnabled()) {
    var value = window.localStorage.getItem(key);
    return 'undefined' === value ? undefined : value;
  }
  return session[key];
}

//Returns URL code argument, if supplied as callback by Jawbone auth process
function getCode() {
  var regex = new RegExp("[\\?&]code=([^&#]*)");
  var results = regex.exec(window.location.href);
  return results == null ? null : results[1];
}

//Perform a full disconnection process, destroying token and session on Jawbone website
function disconnect() {
  var uri = $(this).attr('href');
  user.disconnect(function(data, textStatus, jqXHR) {
    setSession("token", null);
    window.location.href = uri;
  });
  return false;
}

$(document).ready(function() {

  //Create and load user
  user = new User();
  var code = getCode();
  if (code) {
    user.requestToken(code);
  } else {
    user.load();
  }
  $('#disconnect').on('click', disconnect);

  //Set all links to relative, in order to allow other domain names thant fitpet.comelaire.fr
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

