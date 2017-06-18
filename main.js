/**
 * Created by Atypique on 10/05/2017.
 */

var session = {};
var user;

//Permet d'avoir une session côté client
//si le nav le support
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
});

