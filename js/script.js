function passwordCheck() {
    var input = document.getElementById('password');
    if (input.value.length > 0)return true;
    else return false;
}


function gotoupload() {
    if (!passwordCheck()) return;

    var md5 = function(value) {
        return CryptoJS.MD5(value).toString();
    };

    var pass = md5($("#password").val());

    $.ajax({
        url: 'http://localhost:8090/login',
        type: 'POST',
        content: 'application/json',
        dataType: 'json',
        data: {
            password: pass
        },
        success: function (data, textStatus, xhr) {
            console.log('Failure', data);
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#alert-msg").removeClass('hide');
            setTimeout(function () {
                $("#alert-msg").addClass('hide');
            }, 3000);
        }
    });
}


function gotogallery(){


}