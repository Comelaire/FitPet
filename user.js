function User() {
  
}

User.prototype.getScore = function(details) {
  return details.calories;
}

User.prototype.getMoveXp = function(t) {
  if (t > 1800 && t < 3600) {
    return 5;
  }
  if (t < 10 || t > 5400) {
    return 0;
  }
  return 4000 / (1 + Math.abs(t - 2700));
}

User.prototype.getXp = function(details) {
  var fullxp = 0;
  for (var i = 0 ; i < this.moves.length ; i++) {
    fullxp += this.getMoveXp(this.moves[i].details.active_time);
  }
  return Math.round(fullxp);
}

User.prototype.showGraph = function(type, id, data, number) {
  var chart = new type(id, {
    series: [ {name: 'serie', data: data, showArea: true} ]
  }, {
    axisX: {
      type: Chartist.FixedScaleAxis,
      divisor: Math.min(number, data.length),
      labelInterpolationFnc: function(value) {
        return moment(value).format('MMM D');
      }
    },
    low: 0,
    showArea: true
  });
  
  chart.on('draw', function(data) {
    if(data.type === 'line' || data.type === 'area') {
      data.element.animate({
        d: {
          begin: 2000 * data.index,
          dur: 2000,
          from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
          to: data.path.clone().stringify(),
          easing: Chartist.Svg.Easing.easeOutQuint
        }
      });
    }
  });
  
  
}

User.prototype.ofDate = function(date, callback) {
  for (var i = 0 ; i < this.moves.length ; i++) {
    var m = this.moves[i];
    if (Math.abs(date - this.getDate(m)) < 24 * 60 * 60 * 1000) {
      callback(m);
    }
  }
}

User.prototype.getDate = function(m) {
  var dt = "" + m.date;
  return new Date(dt.substring(0, 4) + "-" + dt.substring(4, 6) + "-" + dt.substring(6, 8));
}
  
User.prototype.graph = function(type, id, accept, y, number) {
  var data = [];
  for (var i = 0 ; i < this.moves.length ; i++) {
    var m = this.moves[i];
    if (accept(m, data)) {
      data.push({
        x: this.getDate(m),
        y: y(m.details)
      });
    }
  }
  this.showGraph(type, id, data, number);
}
  
User.prototype.display = function() {
  var xp = this.getXp();
  $("#xp").attr("value", (xp % 10) * 10).attr("title", xp + " points d'expérience");
  $("#level").html("Niveau " + (1 + Math.trunc(xp/10)));
  var lastWeek = new Date().getTime() - (7 * 24 * 60 * 60 * 1000)
  this.graph(Chartist.Line, "#chartSemaine", m => this.getDate(m).getTime() >= lastWeek, d => this.getScore(d), 7);
  this.graph(Chartist.Bar, "#chartAll", () => true, d => this.getScore(d), 20);
  var notFound = true;
  var html = "<hr>";
  var user = this;
  this.ofDate(new Date(), function(m) {
    var a = m.details.active_time;
    var xp = Math.round(user.getMoveXp(a));
    html += m.title + "<hr>";
    html += "Vous avez été actif " + Math.round(a/60) + " minutes<hr>";
    if (xp == 5) {
      html += "Votre FitPet a gagné 5 points d'expérience aujourd'hui, félicitations ! Pensez à vous reposer afin que votre compagnon récupère.";
    } else if (xp == 0) {
      if (a > 350) {
        html += "Vous avez été trop actif, votre FitPet est trop fatigué pour gagner en expérience... Pensez à vous reposer !";
      } else {
        html += "Votre FitPet veut se dégourdir les jambes, soyez actif pour le faire évoluer !"
      }
    } else {
      html += "Votre FitPet a gagné " + xp + " points d'expérience aujourd'hui, félicitations !";
    }
    html += "<hr><img height=\"125\" src=\"https://jawbone.com" + m.snapshot_image + "\" style=\"width:100%;\" />";
    notFound = false;
  });
  if (notFound) {
    html += "Aucune activité enregistrée aujourd'hui<hr>Connectez votre bracelet Jawbone et faites évoluer votre FitPet !";
  }
  $("#today").html(html);
}

User.prototype.toString = function() {
  return this.data.first + " " + this.data.last;
}

User.prototype.requestConnect = function() {
  $("#connect").show();
}

User.prototype.requestToken = function(code) {
  var user = this;
  var formData = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code
  };
  $.ajax({
    url : "https://jawbone.com/auth/oauth2/token",
    type: "GET",
    data : formData,
    success: function(data, textStatus, jqXHR) {
      setSession("token", data.access_token);
      user.load();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });
}

User.prototype.disconnect = function(success) {
  $.ajax({
    url : "https://jawbone.com/nudge/api/v.1.0/users/@me/PartnerAppMembership",
    type: "DELETE",
    success: success,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + getSession("token"));
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });
}

User.prototype.getData = function(url, callback) {
  var user = this;
  if (getSession("token") == null) {
    this.requestConnect();
  } else {
    var user = this;
    $.ajax({
      url: "https://jawbone.com/nudge/api/v.1.1/" + url,
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + getSession("token"));
      },
      success: function (data, textStatus, jqXHR) {
        callback(data.data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 401) {
          user.requestConnect();
        }
      }
    });
  }
};

User.prototype.load = function() {
  var user = this;
  this.getData("users/@me", function(data) {
    user.data = data;
    document.getElementById("me").innerHTML = user.toString();
    $(".wrapper").show();
    $("#waiting").hide(1000);
  });
  this.getData("users/@me/moves", function(data) {
    user.moves = data.items;
    user.display();
  });
}