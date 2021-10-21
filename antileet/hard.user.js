// ==UserScript==
// @name         antileet hard
// @namespace    antileet hard
// @version      1.0
// @description  Minden leet poszt megszűnik létezni.
// @iconURL      https://leet.hu/wp-content/themes/leet/assets/dist/img/favicon-32x32.png
// @match        *://*.facebook.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.0.js
// ==/UserScript==

var observer = new MutationObserver(() => {
    $("span:contains('leet.hu')").parents().eq(21).remove();
});
observer.observe(document.body, {subtree: true, childList: true});

// importing jquery to remove 1 node, kekw