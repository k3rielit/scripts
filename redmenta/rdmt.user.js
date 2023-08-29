// ==UserScript==
// @name         Redmenta BearerToken
// @namespace    com.k3rielit.redmenta
// @version      1.1
// @description  Tries to load the bearer token, then displays as an overlay.
// @author       k3rielit
// @match        *://redmenta.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redmenta.com
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @updateURL    https://github.com/k3rielit/scripts/raw/main/redmenta/rdmt.user.js
// @downloadURL  https://github.com/k3rielit/scripts/raw/main/redmenta/rdmt.user.js
// ==/UserScript==

(function() {
    'use strict';
    // Functions
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForElement(selector) {
        // Promise constructor anti-pattern, but necessary for too early injections [tested:works]
        // Replacing it with chained promises is better: https://stackoverflow.com/questions/23803743/what-is-the-explicit-promise-construction-antipattern-and-how-do-i-avoid-it
        return new Promise(async (resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            console.log('[waitForElement] Waiting for: '+selector);
            while(!document.body) await sleep(1);
            // Assuming the body exists, wait for the element to appear
            const observer = new MutationObserver((mutationList, observer) => {
                if (document.querySelector(selector)) {
                    console.log(document.querySelector(selector));
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, {
                attributes: true, childList: true, subtree: true
            });
        });
    }

    function stringToElement(str) {
        let template = document.createElement('template');
        template.innerHTML = str.trim();
        return template.content.firstChild;
    }

    // Main
    waitForElement('body').then(() => {
        const localStorageKey = 'rdmt-auth';
        const overlayStyle = 'position: fixed; z-index: 999; left: 10px; bottom: 10px; font-weight: 700; color: white; background-color: rgb(255 83 22); border-radius: 20px; padding: 4px; border: 2px solid rgb(245 206 187); box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);';
        // Load the data before it gets removed
        let auth = {
            token: document.body.getAttribute('data-rdmt'),
            uid: document.body.getAttribute('data-rdmt-id'),
            utype: document.body.getAttribute('data-rdmt-type')
        };
        console.log(auth);
        // Try to mitigate injection timing inconsistency with GM storage (unsafe)
        if(!auth.token && GM_getValue(localStorageKey,null)) auth = JSON.parse(GM_getValue(localStorageKey,null));
        else if(auth.token) GM_setValue(localStorageKey, JSON.stringify(auth));
        // Display it as an overlay
        document.body.appendChild(stringToElement(`<div style="${overlayStyle}">${auth.token ? JSON.stringify(auth) : '[Error] Cringe error happened, please reload the page.'}</div>`));
    });
})();