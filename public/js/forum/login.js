/**
* creates a function to validate login.
* @method
*/

function validate_login(){
    var username = $("#uname1").val();
    var password = $("#pwd1").val();
    if(username.length < 1){
        $("#suname1").text("Oops, you missed this one.");
        return false;
    }else if(password.length < 1){
        $("#spwd1").text("Oops, you missed this one.");
        return false;
    }
    return true;
}

/**
* creates a function to validate new regsitrations.
* @method
*/

function validate_register(){
    var username = $("#uname1").val();
    var pwd1 = $("#pwd1").val();
    var pwd2 = $("#pwd2").val();
    if(username.length < 1){
        $("#suname1").text("Oops, you missed this one.");
        return false;
    }else if(pwd1.length < 1){
        $("#spwd1").text("Oops, you missed this one.");
        return false;
    }else if(pwd2.length < 1){
        $("#spwd2").text("Oops, you missed this one.");
        return false;
    }else if(pwd1 !== pwd2){
        $("#spwd2").text("Password do not match.");
        return false;
    }
    return true;
}
