// ==UserScript==
// @name         YT Swap
// @namespace    k3rielit.ytswap
// @version      1.0
// @description  Swaps between Shorts and Watch UI for the current video.
// @author       github.com/k3rielit
// @match        *://*.youtube.com/*
// @match        *://*.youtu.be/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL  https://github.com/k3rielit/scripts/raw/main/youtube/swap.user.js
// ==/UserScript==

console.log('[YTSwap] Loaded');

// Components
const components = {
    lineawesome: `<link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">`,
    flexmincss: `.container,.row>*{width:100%}.row{display:flex;flex-wrap:wrap}.row>*{flex-shrink:0;max-width:100%}.col{flex:1 0 0%}.col-auto{flex:0 0 auto;width:auto}`,
    buttoncss: `.k-btn{cursor:pointer;border:0;display:inline;border-radius:30px;padding:8px 10px;font-size:20px;max-height:40px;max-width:40px;font-family:Roboto,Arial,sans-serif;font-weight:700;color:var(--yt-spec-text-primary);margin-left:10px}.k-btn:hover{background-color:rgba(255,255,255,.1)}`,
    buttonHome: `<a id="ytsw-home" class="k-btn" href="/"><i class="las la-house-damage"></i></a>`,
    buttonSwapToShorts: `<a id="ytsw-swap" class="k-btn" href="#"><i class="las la-compress"></i></a>`,
    buttonSwapToWatch: `<a id="ytsw-swap" class="k-btn" href="#"><i class="las la-expand"></i></a>`,
    buttonInfo: `<a id="ytsw-info" class="k-btn"><i class="las la-chart-bar"></i></a>`,
    buttonQRCode: `<a id="ytsw-qr" class="k-btn"><i class="las la-qrcode"></i></a>`,
};

// Functions
// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        console.log('[waitForElement] Waiting for: '+selector);
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

function injectCSS(css) {
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main
(async function() {
    await waitForElement('div#buttons.style-scope.ytd-masthead yt-icon');
    const topRightButtonContainer = await waitForElement('div#buttons.style-scope.ytd-masthead');
    const topLeftLogo = await waitForElement('div#start.style-scope.ytd-masthead > #logo');
    document.head.appendChild(stringToElement(components.lineawesome));
    injectCSS(components.flexmincss);
    injectCSS(components.buttoncss);
    let lastHref = window.location.href;
    // YT rerenders UI on route change
    while(true) {
        await sleep(111).then(() => {
            if(lastHref != window.location.href || !document.getElementById('ytsw-home')) {
                lastHref = window.location.href;
                topLeftLogo.innerText = '';
                // waitForElement('#voice-search-button').then((elem) => elem.remove());
                // Determine what components to render
                topLeftLogo.appendChild(stringToElement(components.buttonHome));
                const currentUI = window.location.pathname.split('/')[1];
                if(currentUI == 'shorts' || currentUI == 'watch') {
                    const videoId = window.location.href.includes('?v=') ? window.location.href.split('?v=')[1].substring(0,11) : window.location.pathname.split('/')[2];
                    switch(currentUI) {
                        case 'shorts':
                            topLeftLogo.appendChild(stringToElement(components.buttonSwapToWatch.replace(`href="#"`,`href="https://www.youtube.com/watch?v=${videoId}"`)));
                            break;
                        case 'watch':
                            topLeftLogo.appendChild(stringToElement(components.buttonSwapToShorts.replace(`href="#"`,`href="https://www.youtube.com/shorts/${videoId}"`)));
                            break;
                    }
                    topLeftLogo.appendChild(stringToElement(components.buttonInfo));
                    topLeftLogo.appendChild(stringToElement(components.buttonQRCode));
                }
            }
        });
    }
})();