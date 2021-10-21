// ==UserScript==
// @name         flippity.js
// @namespace    flippity.js
// @iconURL      https://www.flippity.net/images/favicon-32.png
// @version      1.1
// @description  kekw
// @author       k3rielit
// @match        *://*.flippity.net/sh.php*
// @grant        none
// ==/UserScript==
for(let i in data) document.getElementById('a'+i).value=data[i][2];
