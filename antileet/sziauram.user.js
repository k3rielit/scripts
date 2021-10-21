// ==UserScript==
// @name         antileet sziauram
// @namespace    antileet sziauram
// @version      1.0
// @description  SZIA URAM!
// @iconURL      https://leet.hu/wp-content/themes/leet/assets/dist/img/favicon-32x32.png
// @match        *://*.facebook.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.0.js
// ==/UserScript==

var observer = new MutationObserver(() => {
    $("span:contains('leetesport.hu'), span:contains('leet.hu')").parents().eq(10).replaceWith('<div class="sziauram" style="height: 300px;width: 500px;background: url(https://media.discordapp.net/attachments/850826503830241351/850836188382363648/szialeeturam.png) no-repeat;background-size: cover;"></div>');
});
observer.observe(document.body, {subtree: true, childList: true});
