/**
 * Created by Atypique on 11/05/2017.
 */
var User = function (data) {
    this.firstName=data.first;
    /*this.xid=data.xid;
     this.lastName=lastName;
     this.weight=weight;
     this.height=height;*/
};

function chargeUserDatas(){
    requestDataToJawboneUser();
    userUsed = new User(JSON.parse(getSession("user")));
    console.log("USER :"+userUsed);
};

function requestDataToJawboneUser() {
    jawboneCallAPI();
    $.ajax({
        url: "https://jawbone.com/nudge/api/v.1.1/users/@me",
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + getSession("token"));
        },

        success: function (data, textStatus, jqXHR) {
            console.log(data);
            console.log("j'ai reussi pour le user");
            setSession("user", JSON.stringify(data.data));
            console.log(data.data.first);
            console.log("affichage user");
            console.log(getSession("user").first);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            document.getElementById("connectiontest").innerHTML = errorThrown;
        }
    });
};