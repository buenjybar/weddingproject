var domain = '54.201.238.28';
var portLogin = 8082;
var portApp = 8081;
var firstTime = true;

function passwordCheck() {
    var input = document.getElementById('password');
    if (input.value.length > 0)return true;
    else return false;
}

function onError(xhr, textStatus, errorThrown) {
    $("#alert-msg span").text(xhr.responseText);
    $("#alert-msg").removeClass('hide');

    setTimeout(function () {
        $("#alert-msg span").val('impossible de se connecter au serveur.');
        $("#alert-msg").addClass('hide');
    }, 3000);
}

function gotoupload() {
    if (!passwordCheck()) return;

    var md5 = function (value) {
        return CryptoJS.MD5(value).toString();
    };

    var pass = md5($("#password").val());

    $.ajax({
        url: 'http://' + domain + ':' + portLogin + '/login',
        type: 'POST',
        content: 'application/json',
        dataType: 'html',
        data: {
            password: pass
        },
        success: function (data, textStatus, xhr) {
            $("#upload").addClass('hide');
            $("#formContent").append(data);
        },
        error: onError
    });
}

function postForm() {
    $('#postImage')[0].submit(function () {
        return false;
    });

    function resetField() {
        $('#postImage input').val('');//reset input files
    }

    setTimeout(resetField, 1000);
}


function postEmail() {
    $('#postEmail')[0].submit(function () {
        return false;
    });
    function resetField() {
        $('#postEmail input').val('');//reset input   
    }

    setTimeout(resetField, 1000);
}

function displayGallery() {
    $.ajax({
        url: 'http://' + domain + ':' + portLogin + '/gallery',
        type: 'POST',
        content: 'application/html',
        dataType: 'html',
        crossDomain: true,
        data: {},
        error: onError,
        success: function (data, textStatus, xhr) {
            data = JSON.parse(data);
            if (data == null || data.length == null) return;

            $(".row.panel").addClass('hide');
            $('#imageContainer').parent().removeClass('hide');

            function createElement(element) {
                var div = document.createElement('div');
                var img = document.createElement('img');
                img.setAttribute('data-lazy', element);
                div.appendChild(img);
                return div;
            }

            var doms = data.map(createElement);

            $('#imageContainer').append(doms);

            var options = {
                infinite: true,
                arrows: true,
                lazyLoad: 'ondemand',
                centerMode: true,
                slidesToShow : 1,
                slidesToScroll : 1
            };
            $('.slider').slick(options);
        }
    });
}