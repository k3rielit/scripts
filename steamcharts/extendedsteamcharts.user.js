// ==UserScript==
// @name         ExtendedSteamCharts
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add more features to steamcharts.
// @author       k3rielit
// @match        *://*.steamcharts.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcharts.com
// @grant        none
// @downloadURL  https://github.com/k3rielit/scripts/raw/main/steamcharts/extendedsteamcharts.user.js
// ==/UserScript==

(function() {
    'use strict';
    const toInt = function(text) {
        let result = parseInt(text ?? '0');
        return isNaN(result) ? 0 : result;
    };
    const toFloat = function(text) {
        let result = parseFloat(text ?? '0');
        return isNaN(result) ? 0 : result;
    };
    const saveFile = function(filename, content) {
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
    const decideGain = function(current,previous) {
        if(current==previous) {return '';}
        else {return current>previous ? 'gain' : 'loss';}
    }
    const filepath = location.origin+location.pathname+'/chart-data.json';
    const steamid = toInt(location.pathname.split('/')[2]);
    const gametitle = document.querySelector('#app-title > a').innerText;
    const currentIsoTime = new Date().toISOString();
    // CSS
    let style = document.createElement('style');
    style.innerText = `
    .collapsible {
        background-color: #1a1a1a;
        color: white;
        cursor: pointer;
        padding: 14px;
        width: 100%;
        border: none;
        text-align: left;
        outline: none;
        font-size: 15px;
    }

    .active, .collapsible:hover {
        background-color: #222222;
    }

    .collapsible:after {
        content: '+';
        color: white;
        font-weight: bold;
        float: right;
        margin-left: 5px;
    }

    .active:after {
        content: "-";
    }

    .collapsible-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.2s ease-out;
        background-color: #1a1a1a;
        margin-bottom: 20px;
        padding: 0 14px;
    }


    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        right: 0;
        background-color: #1a1a1a;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
        white-space: nowrap;
        width: fit-content;
        text-align: left;
    }

    .dropdown-content a {
        padding: 6px 10px 6px 10px;
        text-decoration: none;
        display: block;
    }

    .dropdown-content a:hover {background-color: #222222;}
    .dropdown:hover .dropdown-content {display: block;}
    `;
    document.head.appendChild(style);
    // HTML
    document.querySelector('#app-links').innerHTML = `
    <div class="dropdown">
        <a href="#" class="dropbtn">JSON Data</a>
        <div class="dropdown-content" style="left:0;">
            <a id="json-nt" href="javascript:;" target="_blank">Open in New Tab</a>
            <a id="json-do" href="javascript:;">Download Original</a>
            <a id="json-dp" href="javascript:;">Download Processed</a>
            <a id="json-lc" href="javascript:;">Log to Console</a>
        </div>
    </div>
    <span> | </span>
    <div class="dropdown">
        <a href="#" class="dropbtn">Steam</a>
        <div class="dropdown-content">
            <a href="steam://run/${steamid}" target="_blank">Play</a>
            <a href="steam://install/${steamid}" target="_blank">Install</a>
            <a href="http://store.steampowered.com/app/${steamid}/" target="_blank">Store Page</a>
            <a href="http://steamcommunity.com/app/${steamid}" target="_blank">Community Hub</a>
        </div>
    </div>
    `;
    // JS
    document.querySelector('#json-nt').href = filepath;
    fetch(filepath).then(raw => raw.json()).then(data => {
        let processedData = {
            name: gametitle,
            steamid: steamid,
            time: currentIsoTime,
            summary: [...document.querySelectorAll('.common-table > tbody > tr')].map(row => {
                let content = row.innerText.split('\t');
                return {
                    period: content[0],
                    averagePlayers: toFloat(content[1].replaceAll(',','')),
                    gain: toFloat(content[2].replaceAll(',','')),
                    gainPercent: toFloat(content[3].replaceAll(',','').replaceAll('%','')),
                    peakPlayers: toFloat(content[4].replaceAll(',','')),
                };
            }),
            data: structuredClone(data).map((m,i) => {
                return {
                    ticks: m[0],
                    time: new Date(m[0]).toISOString(),
                    players: m[1],
                }
            }),
        };
        document.querySelector('#json-do').addEventListener('click',() => {
            saveFile(`steamcharts-${(steamid > 0 ? steamid : 'data')}-${currentIsoTime}.original.json`,JSON.stringify(data,null,4));
        },false);
        document.querySelector('#json-dp').addEventListener('click',() => {
            saveFile(`steamcharts-${(steamid > 0 ? steamid : 'data')}-${currentIsoTime}.processed.json`,JSON.stringify(processedData,null,4));
        },false);
        document.querySelector('#json-lc').addEventListener('click',() => {
            console.log({original:data, processed:processedData});
        },false);
        // details table
        let collapsible = document.createElement('div');
        collapsible.id = 'app-details';
        collapsible.innerHTML = `
        <button id="details-toggle" class="collapsible" onclick="this.classList.toggle('active'); this.nextElementSibling.style.maxHeight = this.nextElementSibling.style.maxHeight ? null : this.nextElementSibling.scrollHeight + 'px';">Details</button>
        <div class="collapsible-content" id="details-container">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th></th>
                        <th class="center">Time</th>
                        <th class="right">Players</th>
                    </tr>
                </thead>
                <tbody>${data.reverse().map((md,i) =>
                    `<tr ${i%2==1?'':'class="odd"'}>
                        <td class="left num">#${i+1}</td>
                        <td class="center num">${new Date(md[0]).toISOString()}</td>
                        <td class="right num ${decideGain( md[1], (data[i+1]??[0,0])[1] )}">${md[1]}</td>
                    </tr>`).join('\n')}
                </tbody>
            </table>
        </div>
        `;
        document.querySelector('#content-wrapper').insertBefore(collapsible,document.querySelector('#app-hours-content'));
    });
    document.querySelector('#app-title > a').innerHTML = `<a href="https://steamdb.info/app/${steamid}/" target="_blank">${gametitle}</a>`;
})();