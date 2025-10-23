// ==UserScript==
// @name         OrigoUtil
// @namespace    http://tampermonkey.net/
// @version      2025-10-23
// @description  Utilities for one of the biggest shitty news site in Hungary.
// @author       k3rielit
// @match        *://*.origo.hu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=origo.hu
// @updateURL    https://github.com/k3rielit/scripts/raw/main/origo/origo_util.user.js
// @downloadURL  https://github.com/k3rielit/scripts/raw/main/origo/origo_util.user.js
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';

    class Downloader {

        /**
         * Downloads a JavaScript object/array as a pretty-printed JSON file.
         * @param {(Object|Array)} data - The object/array to serialize as the file's content.
         * @param {string} [filename="data"] - The filename of the downloaded file.
         */
        static json(data, filename = 'data') {
            const jsonString = JSON.stringify(data, null, 4);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const anchorNode = document.createElement("a");
            anchorNode.href = url;
            anchorNode.download = filename + '.json';
            anchorNode.style.display = "none";

            document.body.appendChild(anchorNode);
            anchorNode.click();

            document.body.removeChild(anchorNode);
            URL.revokeObjectURL(url);
        }

    };

    class Base64 {

        /**
         * @param {string} base64String Raw base64 string that needs to be decoded.
         * @param {string} [decoder] Optionally specify the text decoder.
         * @returns {string} Decoded string content.
         */
        static decodeString(base64String, decoder = 'UTF-8') {
            const binaryString = atob(base64String);
            const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
            return new TextDecoder(decoder).decode(bytes);
        }

    }

    class Origo {
        
        /**
         * @type {?object}
         * @private
         */
        #environment = null;

        /**
         * @returns {?string} The Angular application state extracted from the DOM in its raw base64 form.
         */
        static getBase64State() {
            return document.querySelector('#ng-state').innerText;
        }

        /**
         * @returns {object} The Angular application state.
         */
        static getStateObject() {
            const raw = Origo.getBase64State();
            const decoded = Base64.decodeString(raw);
            return JSON.parse(decoded);
        }

        /**
         * @returns {?object} Lazy loaded Origo environment object. Contains API URLs.
         */
        async getEnvironment() {
            if(this.environment) {
                return this.environment;
            }
            try {
                const response = await fetch('/environment.json');
                if (response.ok) {
                    this.environment = await response.json();
                }
            } catch (error) {
                console.warn("[OrigoUtil.getEnvironment] Failed to fetch environment:", error);
            }
            return this.environment;
        }

        async getApiUrl() {
            const environment = await this.getEnvironment();
            return environment?.apiUrl?.clientApiUrl;
        }

    }

    GM_registerMenuCommand("Download ng-state", () => {
        const state = Origo.getStateObject();
        console.log("[OrigoUtil] ng-state:", state);
        Downloader.json(state, "origo-ng-state");
    });

    GM_registerMenuCommand("Log ng-state", () => console.log("[OrigoUtil] ng-state:", Origo.getStateObject()));

    GM_registerMenuCommand("Log environment", async () => {
        const client = new Origo();
        const environment = await client.getEnvironment();
        console.log("[OrigoUtil] Environment:", environment);
    });

})();