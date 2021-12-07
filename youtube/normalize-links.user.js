// ==UserScript==
// @name         YT Normalize Links
// @namespace    yt_normalize_links
// @version      1.0
// @description  replaces external links with the actual url instead of youtube's own redirect page
// @author       k3rielit
// @match        *://*.youtube.com/watch?*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const callback = () => {
        let redirects = [...document.getElementsByClassName('yt-formatted-string')].filter(f => f.href && f.href.startsWith('https://www.youtube.com/redirect'));
        redirects.forEach(a => {
            let decode = decodeURIComponent(a.href.split('q=')[1]);
            a.href = decode;
            a.innerText = decode.length > 100 ? decode.substring(0,100)+'...' : decode;
        });
    };
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement || document.body, { attributes: true, childList: true, subtree: true });
})();