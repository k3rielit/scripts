// ==UserScript==
// @name         antileet soft
// @namespace    antileet soft
// @version      1.0
// @description  Minden leet poszt mostantól levegő.
// @iconURL      https://leet.hu/wp-content/themes/leet/assets/dist/img/favicon-32x32.png
// @match        *://*.facebook.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.0.js
// ==/UserScript==

var observer = new MutationObserver(() => {
    $("span:contains('leet.hu')").parents().eq(9).html('<div style="font-size: 20px; text-align: center;">Leet Shitpost</div>');
    $("span:contains('Mate Farkas'), span:contains('Dávid Németh')").replaceWith('Leet Employee');
});
observer.observe(document.body, {subtree: true, childList: true});