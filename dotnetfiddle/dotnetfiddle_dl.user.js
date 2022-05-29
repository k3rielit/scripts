// ==UserScript==
// @name         DotNetFiddle Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a Download button to the top to save the code faster.
// @author       k3rielit
// @match        https://dotnetfiddle.net/
// @icon         https://www.google.com/s2/favicons?domain=dotnetfiddle.net
// @grant        none
// @downloadURL  https://github.com/k3rielit/scripts/raw/main/dotnetfiddle/dotnetfiddle_dl.user.js
// ==/UserScript==

(function() {
    'use strict';
    // file download function: https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
    let saveFile = function(filename, content) {
        const blob = new Blob([content], {type: 'text'});
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else{
            const elem = window.document.createElement('a');
            elem.style.display = "none";
            elem.href = window.URL.createObjectURL(blob, { oneTimeOnly: true });
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }
    // create the download button
    let dl = document.createElement('button');
    dl.className = 'btn btn-default';
    dl.innerHTML = `<span class="glyphicon glyphicon glyphicon-download-alt"></span>`;
    dl.onclick = function() {
        // get the file's name from the text input on the page
        let filename = (document.querySelector("#CodeForm > div.main.docked > div.status-line > div.name-container > input[type=text]").value || 'Program')+'.cs';
        // try getCodeBlocks(): https://stackoverflow.com/questions/7306669/how-to-get-all-properties-values-of-a-javascript-object-without-knowing-the-key
        if(fiddle && fiddle.getCodeBlocks) {
            let cobj = fiddle.getCodeBlocks();
            for (let ckey in cobj) {
                if (Object.prototype.hasOwnProperty.call(cobj, ckey)) {
                    saveFile(ckey+'_'+filename,cobj[ckey]);
                }
            }
        }
        // or getEditors(): https://stackoverflow.com/questions/7306669/how-to-get-all-properties-values-of-a-javascript-object-without-knowing-the-key
        else if(fiddle && fiddle.getEditors) {
            let eobj = fiddle.getEditors();
            for (let ekey in eobj) {
                if (Object.prototype.hasOwnProperty.call(eobj, ekey)) {
                    saveFile(ekey+'_'+filename,eobj[ekey].options.value);
                }
            }
        }
        // or just get it from the page (there's a chance that the editor will remove the invisible part of the code even when scrolling)
        else {
            let index = 0;
            [...document.querySelectorAll('.CodeMirror-scroll')].map(m => {
                let originalScroll = m.scrollTop+0;
                m.scrollTop = Number.MAX_SAFE_INTEGER;
                // wait for the scroll to take effect, then revert (to force loading all of the code lines)
                setTimeout(() => {
                    m.scrollTop = originalScroll;
                    let content = [...[...document.querySelectorAll('div.CodeMirror-code')][index].cloneNode(true).querySelectorAll('.CodeMirror-line')].map(l => l.innerText).join('\n');
                    saveFile((index+1)+"_"+filename,content);
                    index++;
                });
            });
        }
    };
    // append the download button
    document.querySelector('#top-navbar > div.navbar-center-container > div.navbar-center-container > div:nth-child(1)').appendChild(dl);
})();