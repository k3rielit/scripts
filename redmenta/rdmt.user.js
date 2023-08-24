// ==UserScript==
// @name         Redmenta BearerToken
// @namespace    com.k3rielit.redmenta
// @version      1.0
// @description  Tries to load the bearer token, then displays as an overlay.
// @author       k3rielit
// @match        *://redmenta.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redmenta.com
// @grant        none
// @run-at       document-start
// @updateURL    https://github.com/k3rielit/scripts/raw/main/redmenta/rdmt.user.js
// @downloadURL  https://github.com/k3rielit/scripts/raw/main/redmenta/rdmt.user.js
// ==/UserScript==

(function() {
    'use strict';
    // Load data before it gets removed
    const auth = {
        token: document.body.getAttribute('data-rdmt'),
        uid: document.body.getAttribute('data-rdmt-id'),
        utype: document.body.getAttribute('data-rdmt-type')
    };
    console.log(auth);
    // Display it as an overlay
    const overlay = document.createElement('div');
    overlay.innerText = JSON.stringify(auth);
    overlay.setAttribute('style','position: fixed; z-index: 999; left: 10px; bottom: 10px; font-weight: 700; color: white; background-color: rgb(255 83 22); border-radius: 20px; padding: 4px; border: 2px solid rgb(245 206 187); box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);');
    document.body.appendChild(overlay);
})();