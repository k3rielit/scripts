// ==UserScript==
// @name         oktatas.hu
// @namespace    oktatas_hu
// @version      2.0
// @author       k3rielit
// @iconURL      https://www.oktatas.hu/design/images/favicon.ico
// @updateURL    https://raw.githubusercontent.com/ahurkatolto/oktatas.hu/master/oktatas_hu.js
// @match        *://dload-oktatas.educatio.hu/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.0.js
// ==/UserScript==

(function() {
    $('body').append(`<div style="position: fixed; z-index: 999; left: 1%; bottom: 3%; font-size: 25px; text-align: center;"><a href="${window.location.href.replace("_fl.pdf","_ut.pdf")}" target="_blank" style="text-decoration: none;" title="Megnyitás új ablakban">🔮</a><hr><a style="text-decoration: none; cursor: pointer;" id="splits" title="Oldalfelezés">📄📄</a></div>`);
    $('embed').attr({ id: 'half1', style: 'width:100%; height: 100%; position:absolute; left: 0; top: 0;' });
    $('body').append(`<embed id="half2" style="display: none; width: 50%; height: 100%; position: absolute; right: 0; top: 0;" src="${window.location.href.replace("_fl.pdf","_ut.pdf")}">`);
    document.getElementById("splits").addEventListener("click", splitScreen);
    var splits = false;
    function splitScreen() {
        $('#half1').css('width',splits ? '100%' : '50%');
        $('#half2').css('display',splits ? 'none' : 'block');
        $('#splits').text(splits ? '📄📄' : '📄❌');
        splits = !splits;
    }
})();
